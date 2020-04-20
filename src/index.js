/* eslint camelcase: 0 */
import * as fs from 'fs';
import Shopify from './services/Shopify';
import Environment from './environment/Environment';

let json;
try {
  // eslint-disable-next-line
  json = require('../../syncTheme/manifest.json');
} catch (e) {
  console.error('Manifest does not exist, creating new one');
  json = [];
}

const hashmapManifest = json.reduce((obj, cur) => {
  const { key } = cur;
  obj[key] = { ...cur };
  return obj;
}, {});

const wroteFile = async file => {
  return new Promise((resolve, reject) => {
    const { key, value, attachment } = file;
    const writeContent = value || attachment;
    const encoding = value ? 'utf8' : 'base64';

    fs.writeFile(`/root/syncTheme/${key}`, writeContent, encoding, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

/**
 *
 * @param {object} file - Shopify Asset object
 * @param {object} hashmap - A Hashmap of all the shopify Assets
 * @returns {boolean} - returns true if this file should not be downloaded.
 */
const isSkipFileLogic = (file, hashmap) => {
  const { key } = file;

  const isLiquid = key.includes('.liquid');
  const conflictFileKey = isLiquid
    ? key.replace('.liquid', '')
    : `${key}.liquid`;

  const conflictFileUpdatedAt = hashmap[conflictFileKey]?.updated_at;
  const fileUpdatedAt = file.updated_at;

  if (!conflictFileUpdatedAt) {
    return false; // no conflict
  }

  const fileUpdateTime = new Date(fileUpdatedAt).getTime();
  const conflictUpdateTime = new Date(conflictFileUpdatedAt).getTime();

  return fileUpdateTime > conflictUpdateTime; // if conflict file is ahead, strip out the current one.
};

const init = async () => {
  try {
    const shopify = new Shopify(
      Environment.shopifyStore,
      Environment.shopifyAPI,
      Environment.shopifyPass
    );

    const themes = await shopify.getThemes();

    let id;
    if (Environment.shopifyThemeId) {
      id = Environment.shopifyThemeId;
    } else {
      const liveTheme = themes.find(t => t?.role?.toLowerCase() === 'main');
      id = liveTheme.id;
    }

    const manifest = await shopify.getAssetManifest(id);

    fs.writeFileSync(`/root/syncTheme/manifest.json`, JSON.stringify(manifest));

    const themeHashmapManifest = manifest.reduce((obj, cur) => {
      const { key } = cur;
      obj[key] = { ...cur };
      return obj;
    }, {});

    const downloadFiles = manifest
      .filter(file => {
        const { key } = file;

        if (
          key.includes('assets') &&
          isSkipFileLogic(file, themeHashmapManifest)
        ) {
          return false;
        }

        const themeUpdatedAt = file.updated_at;
        const repoUpdatedAt = hashmapManifest[key]?.updated_at;

        if (!repoUpdatedAt) {
          return true;
        }

        const repoUpdateTime = new Date(repoUpdatedAt).getTime();
        const themeUpdateTime = new Date(themeUpdatedAt).getTime();

        return themeUpdateTime > repoUpdateTime;
      })
      .map(f => f.key);

    const files = [];

    for (let i = 0; i < downloadFiles.length; i++) {
      const shopifyKey = downloadFiles[i];

      const asset = await shopify.getAsset(id, shopifyKey);
      files.push(asset);
    }

    const promises = files.map(file => wroteFile(file));
    await Promise.all(promises); // Wait for all files to finish writing.
  } catch (e) {
    console.error(e);
  }
};

const start = Date.now();

init()
  .then(() => {
    const end = Date.now();
    const timeSpent = (end - start) / 1000;
    console.log(`Took ${timeSpent} Seconds to Run!`);
    process.exit(0);
  })
  .catch(() => process.exit(1));
