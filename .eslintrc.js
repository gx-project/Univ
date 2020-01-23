module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true
  },
  extends: ["standard", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"]
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  parser: "babel-eslint",
  ignorePatterns: ["lib", "node_modules"]
};
