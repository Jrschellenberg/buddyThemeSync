import * as fs from 'fs';
import Shopify from "./services/Shopify";
import Environment from './environment/Environment';

let json;
try {
  json = require('../../syncTheme/manifest.json');
}
catch(e){
  console.error("Manifest does not exist, creating new one");
  json = [];
}

const hashmapManifest = json.reduce((obj, cur) => {
  const { key } = cur;
  obj[key] = {...cur};
  return obj;
}, {});

const wroteFile = async(file) => {
  return new Promise((resolve, reject) => {
    const { shopifyKey, value } = file;
    fs.writeFile(`/root/syncTheme/${shopifyKey}`, value, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}


const init = async () => {
  try {
    const shopify = new Shopify(Environment.shopifyStore, Environment.shopifyAPI, Environment.shopifyPass);

    const themes = await shopify.getThemes();

    const liveTheme = themes.find(t => t?.role?.toLowerCase() === 'main');
    const { id } = liveTheme;
    const manifest = await shopify.getAssetManifest(id);

    fs.writeFileSync(`/root/syncTheme/manifest.json`, JSON.stringify(manifest));

    const downloadFiles = manifest.filter(file => {
      const { key } = file;
      const themeUpdatedAt = file.updated_at;

      const repoUpdatedAt = hashmapManifest[key]?.updated_at;
      if(!repoUpdatedAt){
        return true;
      }

      const repoUpdateTime = new Date(repoUpdatedAt).getTime();
      const themeUpdateTime = new Date(themeUpdatedAt).getTime();

      return themeUpdateTime > repoUpdateTime;
    }).map(f => f.key);

    const files = [];

    for(let i=0; i< downloadFiles.length; i++) {
      const shopifyKey = downloadFiles[i];

      const asset = await shopify.getAsset(id, shopifyKey);

      const { value } = asset;

      files.push({
        shopifyKey,
        value
      });
    }

    const promises = files.map(file => wroteFile(file));
    await Promise.all(promises); // Wait for all files to finish writing.
  }
  catch(e){
    console.error(e);
  }
}


const start = Date.now();

init()
  .then(() => {
    const end = Date.now();
    const timeSpent = (end - start)/1000;
    console.log(`Took ${timeSpent} Seconds to Run!`);
    process.exit(0);
  })
  .catch(() => process.exit(1));
