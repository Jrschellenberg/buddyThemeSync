module.exports = {
  "extends": [
    "eslint-config-bold-cs"
  ],

  rules: {
    'no-plusplus': [
        "error", {
        "allowForLoopAfterthoughts": true
      }
    ]
  }
}
