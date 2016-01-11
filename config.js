System.config({
  baseURL: "",
  defaultJSExtensions: true,
  transpiler: "typescript",
  packages: {"src": {defaultExtension: "ts"}},
  paths: {
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "es6-collections": "npm:es6-collections@0.5.5",
    "typescript": "npm:typescript@1.8.0-dev.20160108"
  }
});
