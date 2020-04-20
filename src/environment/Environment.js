require('dotenv').config();

export default class Environment {
  static shopifyStore = process.env.SHOPIFY_STORE;
  static shopifyAPI = process.env.SHOPIFY_API_KEY;
  static shopifyPass = process.env.SHOPIFY_PASSWORD;
}
