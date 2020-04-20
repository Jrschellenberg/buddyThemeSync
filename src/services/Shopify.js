import ShopifyAPI from 'shopify-api-node';

export default class Shopify {
  constructor(shopName, apiKey, password) {
    this.shopify = new ShopifyAPI({
      shopName,
      password,
      apiKey,
      autoLimit: true,
    });
  }

  async getAssetManifest(id) {
    try {
      return await this.shopify.asset.list(id);
    } catch (e) {
      console.error('Could not get Shopify Assets!');
      throw new Error(e);
    }
  }

  async getAsset(id, key) {
    try {
      return await this.shopify.asset.get(id, {
        'asset[key]': key,
      });
    } catch (e) {
      console.error('Could not get Shopify Assets!');
      throw new Error(e);
    }
  }

  async getThemes() {
    try {
      const themes = await this.shopify.theme.list();
      return themes;
    } catch (e) {
      console.error('Could not get Shopify Live Theme Id!');
      throw new Error(e);
    }
  }
}
