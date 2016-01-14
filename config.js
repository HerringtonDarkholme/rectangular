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
    },
    "sample": {
      "defaultExtension": "ts"
    }
  },

  map: {
    "easy-style": "npm:easy-style@1.0.0",
    "es6-collections": "npm:es6-collections@0.5.5",
    "prefix-lite": "npm:prefix-lite@0.0.1",
    "typescript": "npm:typescript@1.8.0-dev.20160108",
    "npm:easy-style@1.0.0": {
      "free-style": "npm:free-style@1.0.2"
    }
  }
});
