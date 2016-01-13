System.config({
  baseURL: "",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "src": {
      "defaultExtension": "ts"
    }
  },

  map: {
    "easy-style": "npm:easy-style@1.0.0",
    "es6-collections": "npm:es6-collections@0.5.5",
    "typescript": "npm:typescript@1.8.0-dev.20160108",
    "npm:easy-style@1.0.0": {
      "free-style": "npm:free-style@1.0.2"
    }
  }
});
