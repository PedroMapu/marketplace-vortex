export type RotaProtegida =
  | { nome: "anunciar" }
  | { nome: "meus-anuncios" }
  | { nome: "conversas"; ofertaId?: number }
  | { nome: "conta" };

export type RotaAutenticacao =
  | { nome: "entrar"; redirecionarPara?: string }
  | { nome: "cadastro"; redirecionarPara?: string }
  | { nome: "esqueci-senha" }
  | { nome: "redefinir-senha"; token: string | null };

export type RotaInformativa =
  | { nome: "ajuda" }
  | { nome: "contato" }
  | { nome: "termos" }
  | { nome: "privacidade" };

export type RotaAplicacao =
  | { nome: "inicio" }
  | { nome: "catalogo" }
  | { nome: "detalhes-anuncio"; anuncioId: number }
  | RotaProtegida
  | RotaAutenticacao
  | RotaInformativa
  | { nome: "nao-encontrada"; caminho: string };

const CAMINHOS_REDIRECIONAMENTO_PERMITIDOS = new Set([
  "/anunciar",
  "/meus-anuncios",
  "/conversas",
  "/conta",
]);

function normalizarCaminho(caminho: string): string {
  if (caminho === "") {
    return "/";
  }

  const semBarrasFinais = caminho.replace(/\/{2,}/gu, "/").replace(/\/+$/u, "");
  return semBarrasFinais || "/";
}

function obterIdPositivo(correspondencia: RegExpMatchArray | null): number | null {
  if (!correspondencia) {
    return null;
  }

  const id = Number(correspondencia[1]);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function sanitizarRedirecionamento(valor: string | null): string | undefined {
  if (!valor) {
    return undefined;
  }

  const caminho = normalizarCaminho(valor);

  if (CAMINHOS_REDIRECIONAMENTO_PERMITIDOS.has(caminho)) {
    return caminho;
  }

  if (/^\/conversas\/[1-9]\d*$/u.test(caminho)) {
    return caminho;
  }

  return undefined;
}

export function interpretarRota(url: URL): RotaAplicacao {
  const caminho = normalizarCaminho(url.pathname);
  const redirecionarPara = sanitizarRedirecionamento(
    url.searchParams.get("redirect"),
  );

  switch (caminho) {
    case "/":
      return { nome: "inicio" };
    case "/anuncios":
      return { nome: "catalogo" };
    case "/anunciar":
      return { nome: "anunciar" };
    case "/meus-anuncios":
      return { nome: "meus-anuncios" };
    case "/entrar":
      return { nome: "entrar", redirecionarPara };
    case "/cadastro":
      return { nome: "cadastro", redirecionarPara };
    case "/esqueci-senha":
      return { nome: "esqueci-senha" };
    case "/redefinir-senha":
      return {
        nome: "redefinir-senha",
        token: url.searchParams.get("token"),
      };
    case "/conversas":
      return { nome: "conversas" };
    case "/conta":
      return { nome: "conta" };
    case "/ajuda":
      return { nome: "ajuda" };
    case "/contato":
      return { nome: "contato" };
    case "/termos":
      return { nome: "termos" };
    case "/privacidade":
      return { nome: "privacidade" };
    default:
      break;
  }

  const anuncioId = obterIdPositivo(caminho.match(/^\/anuncios\/(\d+)$/u));

  if (anuncioId !== null) {
    return { nome: "detalhes-anuncio", anuncioId };
  }

  const ofertaId = obterIdPositivo(caminho.match(/^\/conversas\/(\d+)$/u));

  if (ofertaId !== null) {
    return { nome: "conversas", ofertaId };
  }

  return { nome: "nao-encontrada", caminho };
}

export function rotaEhProtegida(rota: RotaAplicacao): rota is RotaProtegida {
  return ["anunciar", "meus-anuncios", "conversas", "conta"].includes(
    rota.nome,
  );
}

export function caminhoDaRota(rota: Exclude<RotaAplicacao, { nome: "nao-encontrada" }>): string {
  switch (rota.nome) {
    case "inicio":
      return "/";
    case "catalogo":
      return "/anuncios";
    case "detalhes-anuncio":
      return `/anuncios/${rota.anuncioId}`;
    case "anunciar":
      return "/anunciar";
    case "meus-anuncios":
      return "/meus-anuncios";
    case "entrar":
    case "cadastro": {
      const caminho = rota.nome === "entrar" ? "/entrar" : "/cadastro";
      return rota.redirecionarPara
        ? `${caminho}?redirect=${encodeURIComponent(rota.redirecionarPara)}`
        : caminho;
    }
    case "esqueci-senha":
      return "/esqueci-senha";
    case "redefinir-senha":
      return rota.token
        ? `/redefinir-senha?token=${encodeURIComponent(rota.token)}`
        : "/redefinir-senha";
    case "conversas":
      return rota.ofertaId ? `/conversas/${rota.ofertaId}` : "/conversas";
    case "conta":
      return "/conta";
    case "ajuda":
      return "/ajuda";
    case "contato":
      return "/contato";
    case "termos":
      return "/termos";
    case "privacidade":
      return "/privacidade";
  }
}

export function caminhoDeEntradaPara(rota: RotaProtegida): string {
  return caminhoDaRota({
    nome: "entrar",
    redirecionarPara: caminhoDaRota(rota),
  });
}

export function caminhoLegadoParaRota(hash: string): string | null {
  const rotasLegadas: Readonly<Record<string, string>> = {
    "#lista-anuncios": "/anuncios",
    "#painel-novo-anuncio": "/anunciar",
    "#painel-meus-anuncios": "/meus-anuncios",
    "#entrar": "/entrar",
    "#entrar/anunciar": "/entrar?redirect=%2Fanunciar",
    "#entrar/meus-anuncios": "/entrar?redirect=%2Fmeus-anuncios",
  };

  return rotasLegadas[hash] ?? null;
}
