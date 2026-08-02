"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const {
  TAMANHO_MAXIMO_IMAGEM_BYTES,
  schemaCadastro,
  schemaLogin,
  schemaFotoPerfil,
  schemaSolicitacaoRedefinicao,
  schemaConfirmacaoRedefinicao,
  schemaAnuncio,
  schemaFiltrosAnuncios,
  schemaParametroAnuncio,
} = require("../validacao");
const { validarComSchema } = require("../erros-api");

function anuncioValido(sobrescritas = {}) {
  return {
    nome: "Mesa",
    categoria: "casa",
    condicao: "usado",
    modalidade: "venda",
    valor: 10.5,
    localizacao: "Fortaleza",
    descricao: "Mesa de madeira.",
    imagemUrl: "data:image/png;base64,iVBORw0KGgo=",
    ...sobrescritas,
  };
}

test("cadastro normaliza texto/e-mail e aplica limites em caracteres e bytes", () => {
  const valido = schemaCadastro.parse({
    nome: "  Ana  ",
    email: "  ANA@EDU.UNIFOR.BR  ",
    senha: "á".repeat(36),
  });

  assert.deepEqual(valido, {
    nome: "Ana",
    email: "ana@edu.unifor.br",
    senha: "á".repeat(36),
  });

  for (const entrada of [
    {
      nome: "a".repeat(81),
      email: "ana@edu.unifor.br",
      senha: "12345678",
    },
    {
      nome: "Ana",
      email: `${"a".repeat(241)}@edu.unifor.br`,
      senha: "12345678",
    },
    {
      nome: "Ana",
      email: "ana@edu.unifor.br",
      senha: `a${"á".repeat(36)}`,
    },
  ]) {
    assert.equal(schemaCadastro.safeParse(entrada).success, false);
  }
});

test("cadastro aceita somente o domínio institucional edu.unifor.br", () => {
  assert.equal(
    schemaCadastro.safeParse({
      nome: "Ana",
      email: "ana@edu.unifor.br",
      senha: "12345678",
    }).success,
    true,
  );

  for (const email of [
    "ana@gmail.com",
    "ana@unifor.br",
    "ana@edu.unifor.br.exemplo.com",
  ]) {
    const resultado = schemaCadastro.safeParse({
      nome: "Ana",
      email,
      senha: "12345678",
    });

    assert.equal(resultado.success, false);
    assert.equal(
      resultado.error?.issues.some(
        (issue) =>
          issue.path[0] === "email" &&
          issue.message === "Use seu e-mail institucional @edu.unifor.br.",
      ),
      true,
    );
  }
});

test("login e redefinição compartilham e-mail e senha entre 8 e 72 bytes", () => {
  const loginValido = schemaLogin.safeParse({
    email: "ana@example.com",
    senha: "12345678",
  });

  assert.equal(loginValido.success, true);
  assert.equal(loginValido.data?.manterConectado, false);
  assert.equal(
    schemaLogin.safeParse({
      email: "ana@example.com",
      senha: "12345678",
      manterConectado: "sim",
    }).success,
    false,
  );
  assert.equal(
    schemaLogin.safeParse({
      email: "ana@example.com",
      senha: "1234567",
    }).success,
    false,
  );
  assert.equal(
    schemaSolicitacaoRedefinicao.safeParse({
      email: "endereco-invalido",
    }).success,
    false,
  );
  assert.equal(
    schemaConfirmacaoRedefinicao.safeParse({
      token: "a".repeat(43),
      novaSenha: "12345678",
    }).success,
    true,
  );
});

test("anúncio aplica enums, tamanhos, faixa monetária e duas casas", () => {
  assert.equal(schemaAnuncio.safeParse(anuncioValido()).success, true);

  for (const entrada of [
    anuncioValido({ nome: "a".repeat(81) }),
    anuncioValido({ categoria: "veiculos" }),
    anuncioValido({ condicao: "quebrado" }),
    anuncioValido({ modalidade: "troca" }),
    anuncioValido({ valor: -0.01 }),
    anuncioValido({ valor: 1_000_000.01 }),
    anuncioValido({ valor: 10.001 }),
    anuncioValido({ localizacao: "a".repeat(121) }),
    anuncioValido({ descricao: "a".repeat(1_001) }),
  ]) {
    assert.equal(schemaAnuncio.safeParse(entrada).success, false);
  }

  assert.equal(
    schemaAnuncio.safeParse(
      anuncioValido({ modalidade: "venda", valor: 0 }),
    ).success,
    false,
  );
  assert.equal(
    schemaAnuncio.safeParse(
      anuncioValido({ modalidade: "doacao", valor: 0.01 }),
    ).success,
    false,
  );
  assert.equal(
    schemaAnuncio.safeParse(
      anuncioValido({ modalidade: "doacao", valor: 0 }),
    ).success,
    true,
  );
});

test("imagem aceita somente PNG/JPEG data URL com até 15 MB decodificados", () => {
  const imagemNoLimite = Buffer.alloc(TAMANHO_MAXIMO_IMAGEM_BYTES);
  Buffer.from([0xff, 0xd8, 0xff]).copy(imagemNoLimite);
  const noLimite = imagemNoLimite.toString("base64");
  const imagemAcimaDoLimite = Buffer.alloc(
    TAMANHO_MAXIMO_IMAGEM_BYTES + 1,
  );
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(
    imagemAcimaDoLimite,
  );
  const acimaDoLimite = imagemAcimaDoLimite.toString("base64");

  assert.equal(
    schemaAnuncio.safeParse(
      anuncioValido({ imagemUrl: `data:image/jpeg;base64,${noLimite}` }),
    ).success,
    true,
  );

  for (const imagemUrl of [
    `data:image/png;base64,${acimaDoLimite}`,
    "",
    "data:image/gif;base64,YWJj",
    "https://example.com/imagem.png",
    "data:image/png;base64,###",
    "data:image/png;base64,YWJj",
    "data:image/jpeg;base64,iVBORw0KGgo=",
  ]) {
    assert.equal(
      schemaAnuncio.safeParse(anuncioValido({ imagemUrl })).success,
      false,
    );
  }

  const semImagem = anuncioValido();
  delete semImagem.imagemUrl;
  assert.equal(schemaAnuncio.safeParse(semImagem).success, false);
});

test("foto de perfil aceita imagem válida de até 15 MB ou remoção", () => {
  assert.equal(
    schemaFotoPerfil.safeParse({
      fotoPerfilUrl: "data:image/png;base64,iVBORw0KGgo=",
    }).success,
    true,
  );
  assert.equal(
    schemaFotoPerfil.safeParse({ fotoPerfilUrl: null }).success,
    true,
  );
  assert.equal(
    schemaFotoPerfil.safeParse({
      fotoPerfilUrl: "https://example.com/foto.png",
    }).success,
    false,
  );
  assert.equal(
    schemaFotoPerfil.safeParse({
      fotoPerfilUrl: "data:image/gif;base64,R0lGODlh",
    }).success,
    false,
  );
});

test("autoria e quaisquer chaves desconhecidas são rejeitadas no anúncio", () => {
  const autoria = validarComSchema(
    schemaAnuncio,
    anuncioValido({
      usuarioId: "d55e51c8-abd6-4775-bf9d-574d876d3f0a",
      usuarioNome: "Atacante",
      admin: true,
    }),
  );

  assert.equal(autoria.sucesso, false);
  assert.deepEqual(autoria.campos, {
    usuarioId: "A autoria do anúncio é definida pela sessão autenticada.",
    usuarioNome: "A autoria do anúncio é definida pela sessão autenticada.",
    admin: "Campo não permitido.",
  });
});

test("query e parâmetro rejeitam valores desconhecidos, repetidos ou inseguros", () => {
  assert.deepEqual(
    schemaFiltrosAnuncios.parse({
      categoria: "eletronicos",
      usuarioId: "d55e51c8-abd6-4775-bf9d-574d876d3f0a",
    }),
    {
      categoria: "eletronicos",
      usuarioId: "d55e51c8-abd6-4775-bf9d-574d876d3f0a",
    },
  );

  assert.equal(
    schemaFiltrosAnuncios.safeParse({ categoria: ["casa", "moda"] }).success,
    false,
  );
  assert.equal(
    schemaFiltrosAnuncios.safeParse({ desconhecido: "1" }).success,
    false,
  );
  assert.equal(schemaParametroAnuncio.parse({ id: "42" }).id, 42);

  for (const id of ["0", "-1", "1.5", "9007199254740992"]) {
    assert.equal(schemaParametroAnuncio.safeParse({ id }).success, false);
  }
});
