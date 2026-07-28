"use strict";

const { z } = require("zod");

const CATEGORIAS = ["livros", "eletronicos", "casa", "moda", "outros"];
const CONDICOES = ["novo", "seminovo", "usado"];
const MODALIDADES = ["venda", "doacao"];
const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const FORMATO_TOKEN_REDEFINICAO = /^[A-Za-z0-9_-]{43}$/u;
const FORMATO_DATA_URL_IMAGEM =
  /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/u;

function textoObrigatorio(nomeCampo, limite) {
  return z
    .string({
      error: `Informe ${nomeCampo}.`,
    })
    .trim()
    .min(1, {
      error: `Informe ${nomeCampo}.`,
    })
    .max(limite, {
      error: `${nomeCampo[0].toUpperCase()}${nomeCampo.slice(1)} deve ter no máximo ${limite} caracteres.`,
    });
}

function senhaValida(senha) {
  return (
    typeof senha === "string" &&
    Buffer.byteLength(senha, "utf8") >= 8 &&
    Buffer.byteLength(senha, "utf8") <= 72
  );
}

const schemaSenha = z
  .string({
    error: "Informe a senha.",
  })
  .refine(senhaValida, {
    error: "A senha deve ter entre 8 e 72 bytes.",
  });

const schemaEmail = z
  .string({
    error: "Informe o e-mail.",
  })
  .trim()
  .max(254, {
    error: "Informe um e-mail válido.",
  })
  .email({
    error: "Informe um e-mail válido.",
  })
  .transform((email) => email.toLowerCase());

const schemaCadastro = z
  .strictObject({
    nome: textoObrigatorio("o nome", 80),
    email: schemaEmail,
    senha: schemaSenha,
  });

const schemaLogin = z.strictObject({
  email: schemaEmail,
  senha: schemaSenha,
});

const schemaSolicitacaoRedefinicao = z.strictObject({
  email: schemaEmail,
});

const schemaConfirmacaoRedefinicao = z.strictObject({
  token: z
    .string({
      error: "Token de redefinição inválido.",
    })
    .regex(FORMATO_TOKEN_REDEFINICAO, {
      error: "Token de redefinição inválido.",
    }),
  novaSenha: schemaSenha,
});

function temAteDuasCasasDecimais(valor) {
  const valorEmCentavos = Math.round(valor * 100);
  return Math.abs(valor - valorEmCentavos / 100) < 1e-9;
}

function validarDataUrlImagem(valor) {
  const correspondencia = FORMATO_DATA_URL_IMAGEM.exec(valor);

  if (!correspondencia || correspondencia[2].length % 4 !== 0) {
    return false;
  }

  const base64 = correspondencia[2];
  const bytesDecodificados =
    (base64.length * 3) / 4 -
    (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);

  if (bytesDecodificados > TAMANHO_MAXIMO_IMAGEM_BYTES) {
    return false;
  }

  const conteudo = Buffer.from(base64, "base64");

  if (
    conteudo.length !== bytesDecodificados ||
    conteudo.toString("base64") !== base64
  ) {
    return false;
  }

  const assinaturaPng = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  const assinaturaJpeg = Buffer.from([0xff, 0xd8, 0xff]);
  const assinatura =
    correspondencia[1] === "png" ? assinaturaPng : assinaturaJpeg;

  return (
    conteudo.length >= assinatura.length &&
    conteudo.subarray(0, assinatura.length).equals(assinatura)
  );
}

const schemaAnuncio = z
  .looseObject({
    nome: textoObrigatorio("o nome", 80),
    categoria: z.enum(CATEGORIAS, {
      error: "Categoria inválida.",
    }),
    condicao: z.enum(CONDICOES, {
      error: "Condição inválida.",
    }),
    modalidade: z.enum(MODALIDADES, {
      error: "Modalidade inválida.",
    }),
    valor: z
      .number({
        error: "Informe um valor numérico.",
      })
      .finite({
        error: "Informe um valor numérico.",
      })
      .min(0, {
        error: "O valor deve ser maior ou igual a zero.",
      })
      .max(1_000_000, {
        error: "O valor deve ser de no máximo R$ 1.000.000.",
      })
      .refine(temAteDuasCasasDecimais, {
        error: "O valor deve ter no máximo duas casas decimais.",
      }),
    localizacao: textoObrigatorio("a localização", 120),
    descricao: textoObrigatorio("a descrição", 1_000),
    imagemUrl: z
      .string({
        error: "A imagem deve ser uma data URL PNG ou JPEG.",
      })
      .trim()
      .refine(validarDataUrlImagem, {
        error:
          "A imagem deve ser PNG ou JPEG em data URL e ter no máximo 5 MB.",
      }),
  })
  .superRefine((dados, contexto) => {
    for (const campo of ["usuarioId", "usuarioNome"]) {
      if (Object.prototype.hasOwnProperty.call(dados, campo)) {
        contexto.addIssue({
          code: "custom",
          path: [campo],
          message: "A autoria do anúncio é definida pela sessão autenticada.",
        });
      }
    }

    const camposPermitidos = new Set([
      "nome",
      "categoria",
      "condicao",
      "modalidade",
      "valor",
      "localizacao",
      "descricao",
      "imagemUrl",
      "usuarioId",
      "usuarioNome",
    ]);

    for (const campo of Object.keys(dados)) {
      if (!camposPermitidos.has(campo)) {
        contexto.addIssue({
          code: "custom",
          path: [campo],
          message: "Campo não permitido.",
        });
      }
    }

    if (dados.modalidade === "venda" && dados.valor === 0) {
      contexto.addIssue({
        code: "custom",
        path: ["valor"],
        message: "Anúncios de venda devem ter valor maior que zero.",
      });
    }

    if (dados.modalidade === "doacao" && dados.valor !== 0) {
      contexto.addIssue({
        code: "custom",
        path: ["valor"],
        message: "Anúncios de doação devem ter valor igual a zero.",
      });
    }
  })
  .transform((dados) => ({
    nome: dados.nome,
    categoria: dados.categoria,
    condicao: dados.condicao,
    modalidade: dados.modalidade,
    valor: dados.valor,
    localizacao: dados.localizacao,
    descricao: dados.descricao,
    imagemUrl: dados.imagemUrl,
  }));

const schemaFiltrosAnuncios = z.strictObject({
  categoria: z
    .enum(CATEGORIAS, {
      error: "Categoria inválida.",
    })
    .optional(),
  usuarioId: z
    .string({
      error: "O ID do usuário deve ser um UUID válido.",
    })
    .trim()
    .uuid({
      error: "O ID do usuário deve ser um UUID válido.",
    })
    .optional(),
});

const schemaParametroAnuncio = z.strictObject({
  id: z
    .string({
      error: "O ID deve ser um número inteiro positivo.",
    })
    .regex(/^[1-9]\d*$/u, {
      error: "O ID deve ser um número inteiro positivo.",
    })
    .transform(Number)
    .refine(Number.isSafeInteger, {
      error: "O ID deve ser um número inteiro positivo.",
    }),
});

module.exports = {
  CATEGORIAS,
  CONDICOES,
  MODALIDADES,
  TAMANHO_MAXIMO_IMAGEM_BYTES,
  schemaCadastro,
  schemaLogin,
  schemaSolicitacaoRedefinicao,
  schemaConfirmacaoRedefinicao,
  schemaAnuncio,
  schemaFiltrosAnuncios,
  schemaParametroAnuncio,
  senhaValida,
  validarDataUrlImagem,
  temAteDuasCasasDecimais,
};
