export type Pesquisas = {
  informacoesPagina: dadosDaPagina;
  nodes: DadosNode[];
};

export type dadosDaPagina = {
  cursosIniciais: string;
  proximaPagina: boolean;
  finalDoCurso: string;
};

export type DadosNode = {
  nomeDoAutor: string;
  criarAtividade: string;
  atualizarAtividade: string;
  releases: { totalDeContas: number };
  linguagemPrincipal: { name: string };
  pullRequests: { totalCount: number };
};