require('dotenv').config();

export default class Environment {
  static shopifyThemeId = process.env.SHOPIFY_THEME_ID;

  static shopifyStore = process.env.SHOPIFY_STORE;

  static shopifyAPI = process.env.SHOPIFY_API_KEY;

  static shopifyPass = process.env.SHOPIFY_PASSWORD;
}
