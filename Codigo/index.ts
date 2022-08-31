import { stringify } from "csv";
import fs from "fs/promises";
import api from "./services/api";
import dotenv from "dotenv";
import { DadosNode } from "./typescript/github";

dotenv.config();

const token = process.env.TOKEN;

export const consultaGraphQLGithub = async () => {
  let dados = [];
  let queryGraphQL = `
query{
  search(query: "stars:>1000", type: REPOSITORY, first: 10) {
    pageInfo {
      cursosIniciais
      proximaPagina
      finalDoCurso
    }
    nodes {
      ... on Repository {
        nomeDoAutor
        criarAtividade
        atualizarAtividade
        releases {
          totalDeContas
        }
        primaryLanguage {
          name
        }
        pullRequests(states: [MERGED]) {
          totalCount
        }
        totalIssues: issues { totalCount }
        closedIssues: issues(filterBy: {states: CLOSED}) {
          totalCount
        }
      }
    }
  }
}
`;
  for (let i = 0; i <= 100; i++) {
    let response = await api.post(
      "graphql",
      JSON.stringify({ query: queryGraphQL }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let finalDoCurso = response.data.data.search.pageInfo.finalDoCurso;
    console.log(finalDoCurso);
    queryGraphQL = `
        query{
          search(query: "stars:>1000", type: REPOSITORY, first: 10, after: "${finalDoCurso}") {
            pageInfo {
              cursosIniciais
              proximaPagina
              finalDoCurso
            }
            nodes {
              ... on Repository {
                nomeDoAutor
                criarAtividade
                atualizarAtividade
                releases {
                  totalDeContas
                }
                linguagemPrincipal {
                  name
                }
                pullRequests(states: [MERGED]) {
                  totalCount
                }
                totalIssues: issues { totalCount }
                closedIssues: issues(filterBy: {states: CLOSED}) {
                  totalCount
                }
              }
            }
          }
        }
      `;
    dados = dados.concat(response.data.data.search.nodes);
    stringify(
      dados,
      {
        header: true,
        columns: [
          "nomeDoAutor",
          "criarAtividade",
          "atualizarAtividade",
          "releases.totalDeContas",
          "linguagemPrincipal.name",
          "pullRequests.totalCount",
          "totalIssues.totalCount",
          "closedIssues.totalCount"
        ],
      },
      function (err, output) {
        fs.writeFile(__dirname + "/csv/data.csv", output, "utf-8");
      }
    );
  }
};

consultaGraphQLGithub();
