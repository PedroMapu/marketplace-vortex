"use strict";

const fs = require("node:fs");
const { stripTypeScriptTypes } = require("node:module");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "../..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function transpileScript(source, filename) {
  return stripTypeScriptTypes(source, {
    mode: "strip",
    sourceUrl: filename,
  });
}

module.exports = {
  readProjectFile,
  transpileScript,
};
