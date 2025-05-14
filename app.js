let mostrarRemover = false; // Variável de controle para visibilidade da coluna de remover
let maravilhasUsadas = []; // Array para armazenar as maravilhas que já foram escolhidas
let nomeJogador = "";

// Função para abrir a modal
function abrirModal() {
  document.getElementById("modalAdicionarJogador").style.display = "flex";
  if (mostrarRemover === true) {
    toggleRemover();
  }
}

// Função para fechar a modal
function fecharModal() {
  document.getElementById("modalAdicionarJogador").style.display = "none";
}

// Função para adicionar jogador, chamada ao submeter o formulário
document
  .getElementById("formAdicionarJogador")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let nome = document.getElementById("nomeJogador").value;
    let maravilha = document.getElementById("maravilhaJogador").value;

    // Validação dos campos
    if (!nome) {
      alert("Por favor, preencha o nome.");
      return;
    }
    if (!maravilha) {
      alert("Por favor, selecione uma maravilha.");
      return;
    }

    adicionarJogador(nome, maravilha); // Chama a função de adicionar jogador com os valores do formulário
    fecharModal(); // Fecha a modal
  });

// Função para adicionar um novo jogador
function adicionarJogador(nomeJogador, maravilha) {
  const tabela = document.querySelector("#jogadores-table tbody");
  const linhasTabela = document.querySelectorAll("#jogadores-table tbody tr");

  for (let linha of linhasTabela) {
    const nomeNaTabela = linha.querySelector("td:nth-child(1)").textContent;

    // Verifica se o nome ou a maravilha já existe
    if (nomeJogador === nomeNaTabela) {
      alert("O nome do jogador já está em uso!");
      return false; // Nome duplicado
    }
  }

  // Cria uma nova linha para o jogador
  const novaLinha = document.createElement("tr");

  // Cria a célula para o nome do jogador
  const celulaNome = document.createElement("td");
  celulaNome.textContent = nomeJogador;
  novaLinha.appendChild(celulaNome);

  // Cria a célula para a maravilha
  const celulaMaravilha = document.createElement("td");
  celulaMaravilha.textContent = maravilha;
  novaLinha.appendChild(celulaMaravilha);

  // Desabilita a opção selecionada da maravilha
  const selectMaravilha = document.getElementById("maravilhaJogador");
  const options = selectMaravilha.querySelectorAll("option");
  options.forEach((option) => {
    if (option.value === maravilha) {
      option.disabled = true; // Desabilita a opção escolhida
      maravilhasUsadas.push(option.value);
    }
  });

  // Adiciona a nova linha na tabela
  tabela.appendChild(novaLinha);
  const select = document.getElementById("maravilhaJogador");
  select.value = ""; // Define o valor como em branco

  // Adiciona uma linha para cada aba 2 até 12 para o jogador
  for (let i = 2; i <= 12; i++) {
    let abaTabela = document.getElementById(`tabelaAba${i}`);
    if (abaTabela) {
      let novaLinhaAba = document.createElement("tr");

      // Adiciona o nome do jogador
      let celulaNomeAba = document.createElement("td");
      celulaNomeAba.textContent = nomeJogador;
      novaLinhaAba.appendChild(celulaNomeAba);

      // Cria campos de input para inserir valores nas abas 2 até 12
      if (abaTabela.id === "tabelaAba8") {
        for (let j = 1; j <= 5; j++) {
          let celulaValorAba = document.createElement("td");
          let inputValor = document.createElement("input");
          inputValor.type = "number";
          inputValor.placeholder = "Insira um valor";
          celulaValorAba.appendChild(inputValor);
          novaLinhaAba.appendChild(celulaValorAba);

          // Adiciona o ouvinte de evento para calcular pontos sempre que o valor for alterado
          inputValor.addEventListener("input", function (event) {
            // Coleta os valores dos 5 inputs
            let valores = Array.from(
              novaLinhaAba.querySelectorAll("input")
            ).map((input) => parseInt(input.value) || 0); // Coleta os valores dos inputs, tratando nulos

            // Chama a função de calcular os pontos da Aba 8
            console.log("valores ", valores);
            let pontos = calcularPontosAba8(valores);
            console.log("pontos ", pontos);

            // Atualiza a tabela da Aba 13 com a pontuação calculada
            let tabelaResultados = document.getElementById("tabelaAba13");
            let linhaResultados = tabelaResultados.querySelector(
              `td[data-jogador="${nomeJogador}"][data-aba="8"]`
            );
            if (linhaResultados) {
              let celulaResultadoAba8 = tabelaResultados.querySelector(
                `td[data-jogador="${nomeJogador}"][data-aba="8"]`
              );
              if (celulaResultadoAba8) {
                celulaResultadoAba8.textContent = pontos;
              }
            }

            // Atualiza o total da tabela de resultados
            atualizarResultados(event);
          });
        }
      } else {
        let celulaValorAba = document.createElement("td");
        let inputValor = document.createElement("input");
        inputValor.type = "number"; // Ou o tipo que você preferir
        inputValor.placeholder = "Insira um valor";
        celulaValorAba.appendChild(inputValor);
        novaLinhaAba.appendChild(celulaValorAba);

        inputValor.dataset.jogador = nomeJogador;
        inputValor.dataset.aba = i;
        inputValor.addEventListener("input", atualizarResultados);

        celulaValorAba.appendChild(inputValor);
        novaLinhaAba.appendChild(celulaValorAba);
      }

      abaTabela.querySelector("tbody").appendChild(novaLinhaAba);
    }
  }
  adicionarLinhaTabelaResultados(nomeJogador);
}

function calcularPontosAba8(valores) {
  let [v1, v2, v3, coringa1, coringa2] = valores;

  function calcularPontosBase(v1, v2, v3) {
    let conjuntos = Math.min(v1, v2, v3);
    return v1 ** 2 + v2 ** 2 + v3 ** 2 + conjuntos * 7;
  }

  let melhorPontuacao = calcularPontosBase(v1, v2, v3);
  let melhorDistribuicao = [v1, v2, v3];

  for (let i = 0; i <= coringa1; i++) {
    for (let j = 0; j <= coringa1 - i; j++) {
      let k = coringa1 - i - j;
      let novaPontuacao = calcularPontosBase(v1 + i, v2 + j, v3 + k);
      if (novaPontuacao > melhorPontuacao) {
        melhorPontuacao = novaPontuacao;
        melhorDistribuicao = [v1 + i, v2 + j, v3 + k];
      }
    }
  }

  [v1, v2, v3] = melhorDistribuicao;

  if (v1 !== 0 || v2 !== 0 || v3 !== 0) {
    let maior = Math.max(v1, v2, v3);
    if (v1 === maior) v1 += coringa2;
    else if (v2 === maior) v2 += coringa2;
    else v3 += coringa2;
  }

  return calcularPontosBase(v1, v2, v3);
}

function adicionarLinhaTabelaResultados(nomeJogador) {
  let tabelaResultados = document
    .getElementById("tabelaAba13")
    .querySelector("tbody");

  let novaLinhaResultados = document.createElement("tr");

  let celulaNome = document.createElement("td");
  celulaNome.textContent = nomeJogador;
  novaLinhaResultados.appendChild(celulaNome);

  for (let i = 2; i <= 12; i++) {
    let celulaValor = document.createElement("td");
    celulaValor.textContent = "0";
    celulaValor.dataset.jogador = nomeJogador;
    celulaValor.dataset.aba = i;
    novaLinhaResultados.appendChild(celulaValor);
  }

  let celulaTotal = document.createElement("td");
  celulaTotal.textContent = "0";
  celulaTotal.dataset.jogador = nomeJogador;
  celulaTotal.classList.add("total");
  novaLinhaResultados.appendChild(celulaTotal);

  tabelaResultados.appendChild(novaLinhaResultados);
}

function atualizarResultados(event) {
  let input = event.target;
  let jogador = input.dataset.jogador;
  let aba = input.dataset.aba;
  let valor = parseInt(input.value) || 0;

  // Se for a aba 3 (Dinheiro), aplica a regra especial
  if (aba == 3) {
    valor = Math.floor(valor / 3);
  } else if (aba == 4) {
    valor = -Math.abs(valor); // Garante que o valor seja sempre negativo
  }

  let tabelaResultados = document.getElementById("tabelaAba13");
  let celulaResultado = tabelaResultados.querySelector(
    `td[data-jogador="${jogador}"][data-aba="${aba}"]`
  );

  if (celulaResultado) {
    celulaResultado.textContent = valor;
  }

  let total = 0;
  for (let i = 2; i <= 12; i++) {
    let celula = tabelaResultados.querySelector(
      `td[data-jogador="${jogador}"][data-aba="${i}"]`
    );
    if (celula) {
      total += parseInt(celula.textContent) || 0;
    }
  }

  let celulaTotal = tabelaResultados.querySelector(
    `td[data-jogador="${jogador}"].total`
  );
  if (celulaTotal) {
    celulaTotal.textContent = total;
  }
  ordenarTabela();
}

function ordenarTabela() {
  let tabela = document.getElementById("tabelaAba13"); // Obtém a tabela da última aba
  let tbody = tabela.querySelector("tbody"); // Obtém o corpo da tabela
  let linhas = Array.from(tbody.querySelectorAll("tr")); // Pega todas as linhas

  // Verifica qual é a posição da coluna "Total"
  let cabecalho = tabela.querySelector("thead tr");
  let colunas = Array.from(cabecalho.querySelectorAll("th"));
  let indiceTotal = colunas.findIndex(
    (th) => th.textContent.trim().toLowerCase() === "total"
  );

  if (indiceTotal === -1) return; // Se não encontrar a coluna "Total", sai da função

  // Ordena as linhas com base no valor da coluna "Total"
  linhas.sort((a, b) => {
    let valorA = parseInt(a.cells[indiceTotal].textContent) || 0;
    let valorB = parseInt(b.cells[indiceTotal].textContent) || 0;
    return valorB - valorA; // Ordena do maior para o menor
  });

  // Reinsere as linhas ordenadas na tabela
  linhas.forEach((linha) => tbody.appendChild(linha));
}

// Função para alternar a visibilidade da coluna de remover
function toggleRemover() {
  mostrarRemover = !mostrarRemover; // Inverte o estado de visibilidade da coluna

  const cabecalhoTabela = document.querySelector("#jogadores-table thead tr");
  let cabecalhoRemover = document.querySelector(".remover-header");

  if (mostrarRemover) {
    // Verifica se a célula de cabeçalho "Remover" já existe
    if (!cabecalhoRemover) {
      const celulaRemover = document.createElement("th");
      celulaRemover.textContent = "Remover";
      cabecalhoTabela.appendChild(celulaRemover);
      celulaRemover.classList.add("remover-header"); // Marca a célula com uma classe para identificação
    }

    // Atualiza as linhas da tabela para adicionar o botão "X"
    const linhasTabela = document.querySelectorAll("#jogadores-table tbody tr");
    linhasTabela.forEach((linha) => {
      // Verifica se a célula de remover já existe antes de adicionar o botão
      if (!linha.querySelector(".remover-column")) {
        let botaoRemover = document.createElement("button");
        botaoRemover.textContent = "X";
        botaoRemover.classList.add("remover-btn");

        let celulaRemover = document.createElement("td");
        celulaRemover.classList.add("remover-column"); // Atribui a classe de largura fixa
        celulaRemover.appendChild(botaoRemover);
        linha.appendChild(celulaRemover);

        // Adiciona o evento de clique para remover a linha
        botaoRemover.addEventListener("click", function () {
          const nomeRemovido =
            linha.querySelector("td:nth-child(1)").textContent; // Obtém o nome do jogador
          linha.remove(); // Remove a linha da tabela
          const selectMaravilha = document.getElementById("maravilhaJogador");
          const options = selectMaravilha.querySelectorAll("option");
          const maravilhaRemovida =
            linha.querySelector("td:nth-child(2)").textContent; // Obtém a maravilha da linha removida
          options.forEach((option) => {
            if (option.value === maravilhaRemovida) {
              option.disabled = false; // Reabilita a opção removida
              maravilhasUsadas = maravilhasUsadas.filter(
                (item) => item !== maravilhaRemovida
              ); // Remove do array maravilhasUsadas
            }
          });

          for (let i = 2; i <= 13; i++) {
            let tabelaAba = document.getElementById(`tabelaAba${i}`);
            if (tabelaAba) {
              let linhas = tabelaAba.querySelectorAll("tbody tr");
              linhas.forEach((linhaAba) => {
                let nomeNaAba =
                  linhaAba.querySelector("td:first-child").textContent;
                if (nomeNaAba === nomeRemovido) {
                  linhaAba.remove(); // Remove a linha correspondente
                }
              });
            }
          }
          verificarRemoverVisibilidade(); // Verifica se deve esconder a coluna "Remover"
        });
      }
    });
  } else {
    // Remove a célula de cabeçalho "Remover"
    if (cabecalhoRemover) {
      cabecalhoTabela.removeChild(cabecalhoRemover);
    }

    // Remove os botões "X" das linhas da tabela
    const linhasTabela = document.querySelectorAll("#jogadores-table tbody tr");
    linhasTabela.forEach((linha) => {
      let botaoRemover = linha.querySelector(".remover-column");
      if (botaoRemover) {
        linha.removeChild(botaoRemover); // Remove a célula da coluna "Remover"
      }
    });
  }
}

// Função para verificar a visibilidade da coluna "Remover"
function verificarRemoverVisibilidade() {
  const linhasTabela = document.querySelectorAll("#jogadores-table tbody tr");

  // Se não houver mais jogadores (linhas), escondemos a coluna "Remover"
  if (linhasTabela.length === 0 && mostrarRemover) {
    toggleRemover(); // Oculta a coluna "Remover" se não houver mais linhas
  }
}

function openTab(event, tabId, color) {
  // Esconde todas as abas
  let contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active"));

  // Remove a classe ativa de todos os botões
  let buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Mostra a aba clicada
  document.getElementById(tabId).classList.add("active");

  // Adiciona a classe ativa ao botão clicado
  event.currentTarget.classList.add("active");

  // Muda a cor da header
  document.getElementById("header").style.backgroundColor = color;

  // Muda a cor de fundo dos cabeçalhos <th> dentro da aba ativa
  let tabelaAtiva = document.querySelector(`#${tabId} table`);
  if (tabelaAtiva) {
    let cabecalhos = tabelaAtiva.querySelectorAll("th");
    cabecalhos.forEach((th) => {
      th.style.backgroundColor = color;
      th.style.color = "#fff"; // Deixa o texto branco para contraste
    });
  }
}

// Registra o Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registrado!"))
    .catch((err) => console.log("Erro ao registrar o Service Worker", err));
}
