const assert = require("node:assert/strict");
const net = require("node:net");
const test = require("node:test");
const express = require("express");

test("importar api.js exporta o Express sem abrir uma porta", () => {
  const listenOriginal = express.application.listen;
  let chamadasDeListen = 0;

  express.application.listen = function listenInterceptado() {
    chamadasDeListen += 1;
    return listenOriginal.apply(this, arguments);
  };

  try {
    delete require.cache[require.resolve("../api")];
    const app = require("../api");
    const servidoresAtivos = process
      ._getActiveHandles()
      .filter((handle) => handle instanceof net.Server);

    assert.equal(typeof app, "function");
    assert.equal(chamadasDeListen, 0);
    assert.deepEqual(servidoresAtivos, []);
  } finally {
    express.application.listen = listenOriginal;
  }
});
