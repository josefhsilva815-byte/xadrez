const pecasP = [
    { nome: "Peão Preto", conteudo: "♟" },
    { nome: "Rei Preto", conteudo: "♚" },
    { nome: "Dama Preto", conteudo: "♛" },
    { nome: "Bispo Preto", conteudo: "♝" },
    { nome: "Cavalo Preto", conteudo: "♞" },
    { nome: "Torre Preto", conteudo: "♜" }
];

const pecasB = [
    { nome: "Peão Branco", conteudo: "♙" },
    { nome: "Rei Branco", conteudo: "♔" },
    { nome: "Dama Branco", conteudo: "♕" },
    { nome: "Bispo Branco", conteudo: "♗" },
    { nome: "Cavalo Branco", conteudo: "♘" },
    { nome: "Torre Branco", conteudo: "♖" }
];

let TB = [
    [`${pecasP[5].conteudo}`, `${pecasP[4].conteudo}`, `${pecasP[3].conteudo}`, `${pecasP[2].conteudo}`, `${pecasP[1].conteudo}`, `${pecasP[3].conteudo}`, `${pecasP[4].conteudo}`, `${pecasP[5].conteudo}`],
    [`${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`, `${pecasP[0].conteudo}`],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    [`${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`, `${pecasB[0].conteudo}`],
    [`${pecasB[5].conteudo}`, `${pecasB[4].conteudo}`, `${pecasB[3].conteudo}`, `${pecasB[2].conteudo}`, `${pecasB[1].conteudo}`, `${pecasB[3].conteudo}`, `${pecasB[4].conteudo}`, `${pecasB[5].conteudo}`]
];

const TH = document.getElementById("tabuleiro");
TH.style.cssText = `
grid-template-columns: repeat(${TB[0].length}, 50px);
grid-template-rows: repeat(${TB.length}, 50px);
`;

const mensagem = document.getElementById("vez");
const reiniciar = document.getElementById("reiniciar");
const desfazer = document.getElementById("desfazer");
const inverter = document.getElementById("inverter");
const telaPromocao = document.getElementById("promover");

let historicoTB = [
    [["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]]
];

let historicoMov = [];
//  [{ P: "", M: "", ANT: { L: "", C: "" }, AT: { L: "", C: "" } }]

let pecasMortas = [];
// [{ P: "", M: "", L: "", C: "" }]

let jogadorAtual = "Branca";
let jogoON = true;
let casaEscolhida = {
    Linha: "",
    Coluna: "",
    Conteudo: ""
};

const Regras = [
    (peao) => {
        const linha = parseInt(peao.className.slice(-2, -1));
        const coluna = parseInt(peao.className.slice(-1));
        const LTM = TB.length;

        if (peao.textContent === pecasP[0].conteudo) {   // PRA BAIXO, LINHA + 1 (Peças Brancas)
            if ((linha + 1) < LTM && TB[(linha + 1)][coluna] === "") {
                TB[(linha + 1)].splice(coluna, 1, "▪");

                if ((linha + 2) < LTM && TB[(linha + 2)][coluna] === "" && peao.className.slice(5, 6) == 1) {  // Só no primeiro movmento do peão preto
                    TB[linha + 2].splice(coluna, 1, "▪");
                };
            };
            if (linha === 4 && (coluna - 1) >= 0 && TB[linha][coluna - 1] === pecasB[0].conteudo) {   // Verificando se é o primeiro movimento do peao à esquerda
                let peaoLadoEsq = document.querySelector(`.casa_${linha}${coluna - 1}`)
                if (peaoLadoEsq.textContent === historicoMov[historicoMov.length - 1].P && peaoLadoEsq.className.slice(5, 6) == 2 && linha === historicoMov[historicoMov.length - 1].AT.L && (coluna - 1) === historicoMov[historicoMov.length - 1].AT.C) {
                    TB[linha + 1].splice((coluna - 1), 1, "▪");
                    document.querySelector(`.casa_${linha + 1}${coluna - 1}`).style.color = "red";
                };
            };
            if (linha === 4 && (coluna + 1) < LTM && TB[linha][coluna + 1] === pecasB[0].conteudo) {   // Verificando se é o primeiro movimento do peao à direita
                let peaoLadoDir = document.querySelector(`.casa_${linha}${coluna + 1}`);
                if (peaoLadoDir.textContent === historicoMov[historicoMov.length - 1].P && peaoLadoDir.className.slice(5, 6) == 2 && linha === historicoMov[historicoMov.length - 1].AT.L && (coluna + 1) === historicoMov[historicoMov.length - 1].AT.C) {
                    TB[linha + 1].splice((coluna + 1), 1, "▪");
                    document.querySelector(`.casa_${linha + 1}${coluna + 1}`).style.color = "red";
                };
            };
            // ------------------- Ataque do peao preto nas diagonais -------------------------------------
            for (let num = 0; num < pecasB.length; num++) {
                if ((linha + 1) < LTM && (coluna - 1) >= 0 && TB[linha + 1][coluna - 1] === pecasB[num].conteudo) {
                    document.querySelector(`.casa_${linha + 1}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
                };
                if ((linha + 1) < LTM && (coluna + 1) < LTM && TB[linha + 1][coluna + 1] === pecasB[num].conteudo) {
                    document.querySelector(`.casa_${linha + 1}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
                };
            };
        };
        if (peao.textContent === pecasB[0].conteudo) {   // PRA CIMA, LINHA - 1 (Peças Brancas)
            if ((linha - 1) >= 0 && TB[(linha - 1)][coluna] === "") {
                TB[(linha - 1)].splice(coluna, 1, "▪");

                if ((linha - 2) >= 0 && TB[(linha - 2)][coluna] === "" && peao.className.slice(5, 6) == 1) {   // Só no primeiro movimento do peão branco
                    TB[(linha - 2)].splice(coluna, 1, "▪");
                };
            };
            if (linha === 3 && (coluna - 1) >= 0 && TB[linha][coluna - 1] === pecasP[0].conteudo) {   // Verificando se é o primeiro movimento do peao à esquerda
                let peaoLadoEsq = document.querySelector(`.casa_${linha}${coluna - 1}`)
                if (peaoLadoEsq.textContent === historicoMov[historicoMov.length - 1].P && peaoLadoEsq.className.slice(5, 6) == 2 && linha === historicoMov[historicoMov.length - 1].AT.L && (coluna - 1) === historicoMov[historicoMov.length - 1].AT.C) {
                    TB[linha - 1].splice((coluna - 1), 1, "▪");
                    document.querySelector(`.casa_${linha - 1}${coluna - 1}`).style.color = "red";
                };
            };
            if (linha === 3 && (coluna + 1) < LTM && TB[linha][coluna + 1] === pecasP[0].conteudo) {   // Verificando se é o primeiro movimento do peao à direita
                let peaoLadoDir = document.querySelector(`.casa_${linha}${coluna + 1}`);
                if (peaoLadoDir.textContent === historicoMov[historicoMov.length - 1].P && peaoLadoDir.className.slice(5, 6) == 2 && linha === historicoMov[historicoMov.length - 1].AT.L && (coluna + 1) === historicoMov[historicoMov.length - 1].AT.C) {
                    TB[linha - 1].splice((coluna + 1), 1, "▪");
                    document.querySelector(`.casa_${linha - 1}${coluna + 1}`).style.color = "red";
                };
            };
            // ------------------- Ataque do peão branco na diagonal --------------------------------------
            for (let num = 0; num < pecasP.length; num++) {
                if ((linha - 1) >= 0 && (coluna - 1) >= 0 && TB[linha - 1][coluna - 1] === pecasP[num].conteudo) {
                    document.querySelector(`.casa_${linha - 1}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
                };
                if ((linha - 1) >= 0 && (coluna + 1) < LTM && TB[linha - 1][coluna + 1] === pecasP[num].conteudo) {
                    document.querySelector(`.casa_${linha - 1}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
                };
            };
        };
    },
    (rei) => {
        const linha = parseInt(rei.className.slice(-2, -1))
        const coluna = parseInt(rei.className.slice(-1));
        const LTM = TB.length;
        const mov = parseInt(rei.className.slice(5, 6));
        console.log(mov)

        if (rei.textContent === pecasP[1].conteudo) {
            if ((linha - 1) >= 0 && TB[(linha - 1)][coluna] === "") {  // PRA CIMA
                TB[(linha - 1)].splice(coluna, 1, "▪");
            } else if ((linha - 1) >= 0 && (TB[(linha - 1)][coluna] === pecasB[0].conteudo || TB[(linha - 1)][coluna] === pecasB[1].conteudo || TB[(linha - 1)][coluna] === pecasB[2].conteudo || TB[(linha - 1)][coluna] === pecasB[3].conteudo || TB[(linha - 1)][coluna] === pecasB[4].conteudo || TB[(linha - 1)][coluna] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha - 1}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha + 1) < LTM && TB[(linha + 1)][coluna] === "") {  // PRA BAIXO
                TB[(linha + 1)].splice(coluna, 1, "▪");
            } else if ((linha + 1) < LTM && (TB[(linha + 1)][coluna] === pecasB[0].conteudo || TB[(linha + 1)][coluna] === pecasB[1].conteudo || TB[(linha + 1)][coluna] === pecasB[2].conteudo || TB[(linha + 1)][coluna] === pecasB[3].conteudo || TB[(linha + 1)][coluna] === pecasB[4].conteudo || TB[(linha + 1)][coluna] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha + 1}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((coluna - 1) >= 0 && TB[linha][coluna - 1] === "") {  // PRA ESQUERDA
                TB[linha].splice((coluna - 1), 1, "▪");
                if ((coluna - 1) >= 0 && TB[linha][coluna - 1] === "▪" && mov === 1) {
                    if ((coluna - 2) >= 0 && TB[linha][coluna - 2] === "") {
                        if ((coluna - 3) >= 0 && TB[linha][coluna - 3] === "") {
                            let torreMOV = document.querySelector(`.casa_${linha}${(coluna - 4)}`);
                            if ((coluna - 4) >= 0 && TB[linha][coluna - 4] === pecasP[5].conteudo && torreMOV.className.slice(5, 6) == 1) {
                                TB[linha].splice((coluna - 2), 1, "▪");
                                document.querySelector(`.casa_${linha}${coluna - 2}`).style.color = "green"
                                console.log(document.querySelector(`.casa_${linha}${coluna - 2}`))
                            };
                        };
                    };
                };
            } else if ((coluna - 1) >= 0 && (TB[linha][(coluna - 1)] === pecasB[0].conteudo || TB[linha][(coluna - 1)] === pecasB[1].conteudo || TB[linha][(coluna - 1)] === pecasB[2].conteudo || TB[linha][(coluna - 1)] === pecasB[3].conteudo || TB[linha][(coluna - 1)] === pecasB[4].conteudo || TB[linha][(coluna - 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((coluna + 1) < LTM && TB[linha][coluna + 1] === "") {  // PRA DIREITA
                TB[linha].splice((coluna + 1), 1, "▪");
                if ((coluna + 1) >= 0 && TB[linha][coluna + 1] === "▪" && mov === 1) {
                    if ((coluna + 2) >= 0 && TB[linha][coluna + 2] === "") {
                        let torreMOV = document.querySelector(`.casa_${linha}${(coluna + 3)}`);
                        if ((coluna + 3) >= 0 && TB[linha][coluna + 3] === pecasP[5].conteudo && torreMOV.className.slice(5, 6) == 1) {
                            TB[linha].splice((coluna + 2), 1, "▪");
                            document.querySelector(`.casa_${linha}${coluna + 2}`).style.color = "green"
                        };
                    };
                };
            } else if ((coluna + 1) < LTM && (TB[linha][(coluna + 1)] === pecasB[0].conteudo || TB[linha][(coluna + 1)] === pecasB[1].conteudo || TB[linha][(coluna + 1)] === pecasB[2].conteudo || TB[linha][(coluna + 1)] === pecasB[3].conteudo || TB[linha][(coluna + 1)] === pecasB[4].conteudo || TB[linha][(coluna + 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };

            if ((linha - 1) >= 0 && (coluna + 1) < LTM && TB[linha - 1][coluna + 1] === "") { // Superior Direito
                TB[linha - 1].splice((coluna + 1), 1, "▪");
            } else if ((linha - 1) >= 0 && (coluna + 1) < LTM && (TB[(linha - 1)][(coluna + 1)] === pecasB[0].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasB[1].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasB[2].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasB[3].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasB[4].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha - 1}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha - 1) >= 0 && (coluna - 1) >= 0 && TB[linha - 1][coluna - 1] === "") { // Superior Esquerdo
                TB[linha - 1].splice((coluna - 1), 1, "▪");
            } else if ((linha - 1) >= 0 && (coluna - 1) >= 0 && (TB[(linha - 1)][(coluna - 1)] === pecasB[0].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasB[1].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasB[2].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasB[3].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasB[4].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha - 1}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna + 1) < LTM && TB[linha + 1][coluna + 1] === "") { // Inferior Direito
                TB[linha + 1].splice((coluna + 1), 1, "▪");
            } else if ((linha + 1) < LTM && (coluna + 1) < LTM && (TB[(linha + 1)][(coluna + 1)] === pecasB[0].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasB[1].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasB[2].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasB[3].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasB[4].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha + 1}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna - 1) >= 0 && TB[linha + 1][coluna - 1] === "") { // Inferior Esquerdo
                TB[linha + 1].splice((coluna - 1), 1, "▪");
            } else if ((linha + 1) < LTM && (coluna - 1) >= 0 && (TB[(linha + 1)][(coluna - 1)] === pecasB[0].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasB[1].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasB[2].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasB[3].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasB[4].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha + 1}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
        };
        if (rei.textContent === pecasB[1].conteudo) {
            if ((linha - 1) >= 0 && TB[(linha - 1)][coluna] === "") {  // PRA CIMA
                TB[(linha - 1)].splice(coluna, 1, "▪");
            } else if ((linha - 1) >= 0 && (TB[(linha - 1)][coluna] === pecasP[0].conteudo || TB[(linha - 1)][coluna] === pecasP[1].conteudo || TB[(linha - 1)][coluna] === pecasP[2].conteudo || TB[(linha - 1)][coluna] === pecasP[3].conteudo || TB[(linha - 1)][coluna] === pecasP[4].conteudo || TB[(linha - 1)][coluna] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha - 1}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha + 1) < LTM && TB[(linha + 1)][coluna] === "") {  // PRA BAIXO
                TB[(linha + 1)].splice(coluna, 1, "▪");
            } else if ((linha + 1) < LTM && (TB[(linha + 1)][coluna] === pecasP[0].conteudo || TB[(linha + 1)][coluna] === pecasP[1].conteudo || TB[(linha + 1)][coluna] === pecasP[2].conteudo || TB[(linha + 1)][coluna] === pecasP[3].conteudo || TB[(linha + 1)][coluna] === pecasP[4].conteudo || TB[(linha + 1)][coluna] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha + 1}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((coluna - 1) >= 0 && TB[linha][coluna - 1] === "") {  // PRA ESQUERDA
                TB[linha].splice((coluna - 1), 1, "▪");
                if ((coluna - 1) >= 0 && TB[linha][coluna - 1] === "▪" && mov === 1) {
                    if ((coluna - 2) >= 0 && TB[linha][coluna - 2] === "") {
                        if ((coluna - 3) >= 0 && TB[linha][coluna - 3] === "") {
                            let torreMOV = document.querySelector(`.casa_${linha}${(coluna - 4)}`);
                            if ((coluna - 4) >= 0 && TB[linha][coluna - 4] === pecasB[5].conteudo && torreMOV.className.slice(5, 6) == 1) {
                                TB[linha].splice((coluna - 2), 1, "▪");
                                document.querySelector(`.casa_${linha}${coluna - 2}`).style.color = "green"
                            };
                        }
                    };
                };
            } else if ((coluna - 1) >= 0 && (TB[linha][(coluna - 1)] === pecasP[0].conteudo || TB[linha][(coluna - 1)] === pecasP[1].conteudo || TB[linha][(coluna - 1)] === pecasP[2].conteudo || TB[linha][(coluna - 1)] === pecasP[3].conteudo || TB[linha][(coluna - 1)] === pecasP[4].conteudo || TB[linha][(coluna - 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((coluna + 1) < LTM && TB[linha][coluna + 1] === "") {  // PRA DIREITA
                TB[linha].splice((coluna + 1), 1, "▪");
                if ((coluna + 1) >= 0 && TB[linha][coluna + 1] === "▪" && mov === 1) {
                    if ((coluna + 2) >= 0 && TB[linha][coluna + 2] === "") {
                        let torreMOV = document.querySelector(`.casa_${linha}${(coluna + 3)}`);
                        if ((coluna + 3) >= 0 && TB[linha][coluna + 3] === pecasB[5].conteudo && torreMOV.className.slice(5, 6) == 1) {
                            TB[linha].splice((coluna + 2), 1, "▪");
                            document.querySelector(`.casa_${linha}${coluna + 2}`).style.color = "green"
                        };
                    };
                };
            } else if ((coluna + 1) < LTM && (TB[linha][(coluna + 1)] === pecasP[0].conteudo || TB[linha][(coluna + 1)] === pecasP[1].conteudo || TB[linha][(coluna + 1)] === pecasP[2].conteudo || TB[linha][(coluna + 1)] === pecasP[3].conteudo || TB[linha][(coluna + 1)] === pecasP[4].conteudo || TB[linha][(coluna + 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };

            if ((linha - 1) >= 0 && (coluna + 1) < LTM && TB[linha - 1][coluna + 1] === "") { // Superior Direito
                TB[linha - 1].splice((coluna + 1), 1, "▪");
            } else if ((linha - 1) >= 0 && (coluna + 1) < LTM && (TB[(linha - 1)][(coluna + 1)] === pecasP[0].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasP[1].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasP[2].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasP[3].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasP[4].conteudo || TB[(linha - 1)][(coluna + 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha - 1}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha - 1) >= 0 && (coluna - 1) >= 0 && TB[linha - 1][coluna - 1] === "") { // Superior Esquerdo
                TB[linha - 1].splice((coluna - 1), 1, "▪");
            } else if ((linha - 1) >= 0 && (coluna - 1) >= 0 && (TB[(linha - 1)][(coluna - 1)] === pecasP[0].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasP[1].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasP[2].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasP[3].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasP[4].conteudo || TB[(linha - 1)][(coluna - 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha - 1}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna + 1) < LTM && TB[linha + 1][coluna + 1] === "") { // Inferior Direito
                TB[linha + 1].splice((coluna + 1), 1, "▪");
            } else if ((linha + 1) < LTM && (coluna + 1) < LTM && (TB[(linha + 1)][(coluna + 1)] === pecasP[0].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasP[1].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasP[2].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasP[3].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasP[4].conteudo || TB[(linha + 1)][(coluna + 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha + 1}${coluna + 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna - 1) >= 0 && TB[linha + 1][coluna - 1] === "") { // Inferior Esquerdo
                TB[linha + 1].splice((coluna - 1), 1, "▪");
            } else if ((linha + 1) < LTM && (coluna - 1) >= 0 && (TB[(linha + 1)][(coluna - 1)] === pecasP[0].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasP[1].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasP[2].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasP[3].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasP[4].conteudo || TB[(linha + 1)][(coluna - 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha + 1}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
        };
    },
    (dama) => {
        const linha = parseInt(dama.className.slice(-2, -1));
        const coluna = parseInt(dama.className.slice(-1));
        const LTM = TB.length;
        let C = 0; let B = 0; let E = 0; let D = 0;
        let SE = 0; let SD = 0; let IE = 0; let ID = 0;

        if (dama.textContent === pecasP[2].conteudo) {
            for (let num = 1; num < LTM; num++) {
                if ((linha - num) >= 0 && TB[linha - num][coluna] === "" && C === 0) {
                    TB[linha - num].splice(coluna, 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) { // Vendo se tem alguma peça da mesma cor no caminho
                        if ((linha - num) >= 0 && TB[linha - num][coluna] === pecasP[p].conteudo && C === 0) {
                            C = 1
                        }
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && TB[linha - num][coluna] === pecasB[b].conteudo && C === 0) {
                            document.querySelector(`.casa_${(linha - num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
                            C = 1
                        };
                    };
                };
                if ((linha + num) < LTM && TB[linha + num][coluna] === "" && B === 0) {
                    TB[linha + num].splice(coluna, 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && TB[linha + num][coluna] === pecasP[p].conteudo && B === 0) {
                            B = 1
                        }
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && TB[linha + num][coluna] === pecasB[b].conteudo && B === 0) {
                            document.querySelector(`.casa_${(linha + num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
                            B = 1
                        };
                    }
                };
                if ((coluna - num) >= 0 && TB[linha][coluna - num] === "" && E === 0) {
                    TB[linha].splice((coluna - num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna - num) >= 0 && TB[linha][coluna - num] === pecasP[p].conteudo && E === 0) {
                            E = 1
                        };
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna - num) >= 0 && TB[linha][coluna - num] === pecasB[b].conteudo && E === 0) {
                            document.querySelector(`.casa_${linha}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            E = 1
                        };
                    }
                }
                if ((coluna + num) < LTM && TB[linha][coluna + num] === "" && D === 0) {
                    TB[linha].splice((coluna + num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna + num) >= 0 && TB[linha][coluna + num] === pecasP[p].conteudo && D === 0) {
                            D = 1
                        };
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna + num) < LTM && TB[linha][coluna + num] === pecasB[b].conteudo && D === 0) {
                            document.querySelector(`.casa_${linha}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            D = 1
                        };
                    }
                }

                if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[linha - num][coluna - num] === "" && SE === 0) {
                    TB[linha - num].splice((coluna - num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[linha - num][coluna - num] === pecasP[p].conteudo && SE === 0) {
                            SE = 1
                        };
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[linha - num][coluna - num] === pecasB[b].conteudo && SE === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SE = 1
                        };
                    }
                }
                if ((linha - num) >= 0 && (coluna + num) < LTM && TB[linha - num][coluna + num] === "" && SD === 0) {
                    TB[linha - num].splice((coluna + num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[linha - num][coluna + num] === pecasP[p].conteudo && SD === 0) {
                            SD = 1
                        }
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[linha - num][coluna + num] === pecasB[b].conteudo && SD === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SD = 1
                        };
                    }
                }
                if ((linha + num) < LTM && (coluna - num) >= 0 && TB[linha + num][coluna - num] === "" && IE === 0) {
                    TB[linha + num].splice((coluna - num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[linha + num][coluna - num] === pecasP[p].conteudo && IE === 0) {
                            IE = 1
                        }
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[linha + num][coluna - num] === pecasB[b].conteudo && IE === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            IE = 1
                        };
                    }
                }
                if ((linha + num) < LTM && (coluna + num) < LTM && TB[linha + num][coluna + num] === "" && ID === 0) {
                    TB[linha + num].splice((coluna + num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && TB[linha + num][coluna + num] === pecasP[p].conteudo && ID === 0) {
                            ID = 1
                        }
                    }
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && TB[linha + num][coluna + num] === pecasB[b].conteudo && ID === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            ID = 1
                        };
                    }
                }
            };
        };
        if (dama.textContent === pecasB[2].conteudo) {
            for (let num = 1; num < LTM; num++) {
                if ((linha - num) >= 0 && TB[linha - num][coluna] === "" && C === 0) {
                    TB[linha - num].splice(coluna, 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && TB[linha - num][coluna] === pecasB[b].conteudo && C === 0) {
                            C = 1
                        }
                    }
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && TB[linha - num][coluna] === pecasP[p].conteudo && C === 0) {
                            document.querySelector(`.casa_${(linha - num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
                            C = 1
                        };
                    }
                }
                if ((linha + num) < LTM && TB[linha + num][coluna] === "" && B === 0) {
                    TB[linha + num].splice(coluna, 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && TB[linha + num][coluna] === pecasB[b].conteudo && B === 0) {
                            B = 1
                        }
                    }
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && TB[linha + num][coluna] === pecasP[p].conteudo && B === 0) {
                            document.querySelector(`.casa_${(linha + num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;"
                            B = 1
                        };
                    }
                }
                if ((coluna - num) >= 0 && TB[linha][coluna - num] === "" && E === 0) {
                    TB[linha].splice((coluna - num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna - num) >= 0 && TB[linha][coluna - num] === pecasB[b].conteudo && E === 0) {
                            E = 1
                        }
                    }
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna - num) >= 0 && TB[linha][coluna - num] === pecasP[p].conteudo && E === 0) {
                            document.querySelector(`.casa_${linha}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            E = 1
                        };
                    }
                }
                if ((coluna + num) < LTM && TB[linha][coluna + num] === "" && D === 0) {
                    TB[linha].splice((coluna + num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna + num) < LTM && TB[linha][coluna + num] === pecasB[b].conteudo && D === 0) {
                            D = 1
                        }
                    }
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna + num) < LTM && TB[linha][coluna + num] === pecasP[p].conteudo && D === 0) {
                            document.querySelector(`.casa_${linha}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            D = 1
                        };
                    }
                }

                if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[linha - num][coluna - num] === "" && SE === 0) {
                    TB[linha - num].splice((coluna - num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[linha - num][coluna - num] === pecasB[b].conteudo && SE === 0) {
                            SE = 1
                        }
                    }
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[linha - num][coluna - num] === pecasP[p].conteudo && SE === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SE = 1
                        };
                    }
                }
                if ((linha - num) >= 0 && (coluna + num) < LTM && TB[linha - num][coluna + num] === "" && SD === 0) {
                    TB[linha - num].splice((coluna + num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[linha - num][coluna + num] === pecasB[b].conteudo && SD === 0) {
                            SD = 1
                        }
                    }
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[linha - num][coluna + num] === pecasP[p].conteudo && SD === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SD = 1;
                        };
                    };
                };
                if ((linha + num) < LTM && (coluna - num) >= 0 && TB[linha + num][coluna - num] === "" && IE === 0) {
                    TB[linha + num].splice((coluna - num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[linha + num][coluna - num] === pecasB[b].conteudo && IE === 0) {
                            IE = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[linha + num][coluna - num] === pecasP[p].conteudo && IE === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            IE = 1;
                        };
                    };
                };
                if ((linha + num) < LTM && (coluna + num) < LTM && TB[linha + num][coluna + num] === "" && ID === 0) {
                    TB[linha + num].splice((coluna + num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && TB[linha + num][coluna + num] === pecasB[b].conteudo && ID === 0) {
                            ID = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && TB[linha + num][coluna + num] === pecasP[p].conteudo && ID === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            ID = 1;
                        };
                    };
                };
            };
        };
    },
    (bispo) => {
        const linha = parseInt(bispo.className.slice(-2, -1));
        const coluna = parseInt(bispo.className.slice(-1));
        const LTM = TB.length;
        let SE = 0; let SD = 0; let IE = 0; let ID = 0;
        if (bispo.textContent === pecasP[3].conteudo) {
            for (let num = 1; num < LTM; num++) {
                // ---------------------------------------------------------------- Superior Esquerdo - SE ------------------------------------------------------------------ //
                if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[(linha - num)][coluna - num] === "" && SE === 0) {
                    TB[(linha - num)].splice((coluna - num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[(linha - num)][coluna - num] === pecasP[p].conteudo && SE === 0) {
                            SE = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[(linha - num)][coluna - num] === pecasB[b].conteudo && SE === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SE = 1;
                        };
                    };
                };
                // ---------------------------------------------------------------- Superior Direito - SD ---------------------------------------------------------------------- //
                if ((linha - num) >= 0 && (coluna + num) < LTM && TB[(linha - num)][(coluna + num)] === "" && SD === 0) {
                    TB[(linha - num)].splice((coluna + num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[(linha - num)][(coluna + num)] === pecasP[p].conteudo && SD === 0) {
                            SD = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[(linha - num)][(coluna + num)] === pecasB[b].conteudo && SD === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SD = 1;
                        };
                    };
                };
                // ---------------------------------------------------------------- Inferior Esquerdo - IE ---------------------------------------------------------------------- //
                if ((linha + num) < LTM && (coluna + num) < LTM && (TB[(linha + num)][(coluna + num)] === "" && IE === 0)) {
                    TB[linha + num].splice((coluna + num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && (TB[(linha + num)][(coluna + num)] === pecasP[p].conteudo && IE === 0)) {
                            IE = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && (TB[(linha + num)][(coluna + num)] === pecasB[b].conteudo && IE === 0)) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            IE = 1;
                        };
                    };
                };
                // ---------------------------------------------------------------- Inferior Direito - ID ----------------------------------------------------------------------- //
                if ((linha + num) < LTM && (coluna - num) >= 0 && TB[(linha + num)][(coluna - num)] === "" && ID === 0) {
                    TB[linha + num].splice((coluna - num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[(linha + num)][(coluna - num)] === pecasP[p].conteudo && ID === 0) {
                            ID = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[(linha + num)][(coluna - num)] === pecasB[b].conteudo && ID === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            ID = 1;
                        };
                    };
                };
            };
        };
        if (bispo.textContent === pecasB[3].conteudo) {
            for (let num = 1; num < LTM; num++) {
                // ---------------------------------------------------------------- Superior Esquerdo - SE ------------------------------------------------------------------ //
                if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[(linha - num)][coluna - num] === "" && SE === 0) {
                    TB[(linha - num)].splice((coluna - num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[(linha - num)][coluna - num] === pecasB[b].conteudo && SE === 0) {
                            SE = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna - num) >= 0 && TB[(linha - num)][coluna - num] === pecasP[p].conteudo && SE === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SE = 1;
                        };
                    };
                };
                // ---------------------------------------------------------------- Superior Direito - SD ---------------------------------------------------------------------- //
                if ((linha - num) >= 0 && (coluna + num) < LTM && TB[(linha - num)][(coluna + num)] === "" && SD === 0) {
                    TB[(linha - num)].splice((coluna + num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[(linha - num)][(coluna + num)] === pecasB[b].conteudo && SD === 0) {
                            SD = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && (coluna + num) < LTM && TB[(linha - num)][(coluna + num)] === pecasP[p].conteudo && SD === 0) {
                            document.querySelector(`.casa_${(linha - num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            SD = 1;
                        };
                    };
                };
                // ---------------------------------------------------------------- Inferior Esquerdo - IE ---------------------------------------------------------------------- //
                if ((linha + num) < LTM && (coluna + num) < LTM && TB[(linha + num)][(coluna + num)] === "" && IE === 0) {
                    TB[linha + num].splice((coluna + num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && TB[(linha + num)][(coluna + num)] === pecasB[b].conteudo && IE === 0) {
                            IE = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna + num) < LTM && TB[(linha + num)][(coluna + num)] === pecasP[p].conteudo && IE === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            IE = 1
                        };
                    };
                };
                // ---------------------------------------------------------------- Inferior Direito - ID ----------------------------------------------------------------------- //
                if ((linha + num) < LTM && (coluna - num) >= 0 && TB[(linha + num)][(coluna - num)] === "" && ID === 0) {
                    TB[linha + num].splice((coluna - num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[(linha + num)][(coluna - num)] === pecasB[b].conteudo && ID === 0) {
                            ID = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && (coluna - num) >= 0 && TB[(linha + num)][(coluna - num)] === pecasP[p].conteudo && ID === 0) {
                            document.querySelector(`.casa_${(linha + num)}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;"
                            ID = 1;
                        };
                    };
                };
            };
        };
    },
    (cavalo) => {
        const linha = parseInt(cavalo.className.slice(-2, -1));
        const coluna = parseInt(cavalo.className.slice(-1));
        const LTM = TB.length;
        if (cavalo.textContent === pecasP[4].conteudo) {
            // ---------------------------------------------------- Pra Cima e Pra Esquerda ----------------------------------------------------------- //
            if ((linha - 2) >= 0 && (coluna - 1) >= 0 && TB[(linha - 2)][(coluna - 1)] === "") {
                TB[(linha - 2)].splice((coluna - 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha - 2) >= 0 && (coluna - 1) >= 0 && TB[linha - 2][coluna - 1] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 2)}${(coluna - 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Cima e Pra Direita ------------------------------------------------------------ //
            if ((linha - 2) >= 0 && (coluna + 1) < LTM && TB[(linha - 2)][(coluna + 1)] === "") {
                TB[(linha - 2)].splice((coluna + 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha - 2) >= 0 && (coluna + 1) < LTM && TB[linha - 2][coluna + 1] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 2)}${(coluna + 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Baixo e Pra Esquerda ---------------------------------------------------------- //
            if ((linha + 2) < LTM && (coluna - 1) >= 0 && TB[(linha + 2)][(coluna - 1)] === "") {
                TB[(linha + 2)].splice((coluna - 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha + 2) < LTM && (coluna - 1) >= 0 && TB[linha + 2][coluna - 1] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 2)}${(coluna - 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Baixo e Pra Esquerda ---------------------------------------------------------- //
            if ((linha + 2) < LTM && (coluna + 1) < LTM && TB[(linha + 2)][(coluna + 1)] === "") {
                TB[(linha + 2)].splice((coluna + 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha + 2) < LTM && (coluna + 1) < LTM && TB[(linha + 2)][(coluna + 1)] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 2)}${(coluna + 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Direita e Pra Cima ------------------------------------------------------------ //
            if ((linha - 1) >= 0 && (coluna + 2) < LTM && TB[(linha - 1)][(coluna + 2)] === "") {
                TB[(linha - 1)].splice((coluna + 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha - 1) >= 0 && (coluna + 2) < LTM && TB[(linha - 1)][(coluna + 2)] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 1)}${(coluna + 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Direita e Pra Baixo ----------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna + 2) < LTM && TB[(linha + 1)][(coluna + 2)] === "") {
                TB[(linha + 1)].splice((coluna + 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha + 1) < LTM && (coluna + 2) < LTM && TB[(linha + 1)][(coluna + 2)] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 1)}${(coluna + 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Esquerda e Pra Cima ----------------------------------------------------------- //
            if ((linha - 1) >= 0 && (coluna - 2) >= 0 && TB[(linha - 1)][(coluna - 2)] === "") {
                TB[(linha - 1)].splice((coluna - 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha - 1) >= 0 && (coluna - 2) >= 0 && TB[(linha - 1)][(coluna - 2)] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 1)}${(coluna - 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
            // ---------------------------------------------------- Pra Esquerda e Pra Baixo ----------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna - 2) >= 0 && TB[(linha + 1)][(coluna - 2)] === "") {
                TB[(linha + 1)].splice((coluna - 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasB.length; num++) {
                    if ((linha + 1) < LTM && (coluna - 2) >= 0 && TB[(linha + 1)][(coluna - 2)] === pecasB[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 1)}${(coluna - 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    }
                }
            }
        };
        if (cavalo.textContent === pecasB[4].conteudo) {
            // ---------------------------------------------------- Pra Cima e Pra Esquerda ----------------------------------------------------------- //
            if ((linha - 2) >= 0 && (coluna - 1) >= 0 && TB[(linha - 2)][(coluna - 1)] === "") {
                TB[(linha - 2)].splice((coluna - 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha - 2) >= 0 && (coluna - 1) >= 0 && TB[(linha - 2)][(coluna - 1)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 2)}${(coluna - 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                };
            };
            // ---------------------------------------------------- Pra Cima e Pra Direita ------------------------------------------------------------ //
            if ((linha - 2) >= 0 && (coluna + 1) < LTM && TB[(linha - 2)][(coluna + 1)] === "") {
                TB[(linha - 2)].splice((coluna + 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha - 2) >= 0 && (coluna + 1) < LTM && TB[(linha - 2)][(coluna + 1)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 2)}${(coluna + 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                };
            };
            // ---------------------------------------------------- Pra Baixo e Pra Esquerda ---------------------------------------------------------- //
            if ((linha + 2) < LTM && (coluna - 1) >= 0 && TB[(linha + 2)][(coluna - 1)] === "") {
                TB[(linha + 2)].splice((coluna - 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha + 2) < LTM && (coluna - 1) >= 0 && TB[(linha + 2)][(coluna - 1)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 2)}${(coluna - 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                };
            };
            // ---------------------------------------------------- Pra Baixo e Pra Esquerda ---------------------------------------------------------- //
            if ((linha + 2) < LTM && (coluna + 1) < LTM && TB[(linha + 2)][(coluna + 1)] === "") {
                TB[(linha + 2)].splice((coluna + 1), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha + 2) < LTM && (coluna + 1) < LTM && TB[(linha + 2)][(coluna + 1)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 2)}${(coluna + 1)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                };
            };
            // ---------------------------------------------------- Pra Direita e Pra Cima ------------------------------------------------------------ //
            if ((linha - 1) >= 0 && (coluna + 2) < LTM && TB[(linha - 1)][(coluna + 2)] === "") {
                TB[(linha - 1)].splice((coluna + 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha - 1) >= 0 && (coluna + 2) < LTM && TB[(linha - 1)][(coluna + 2)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 1)}${(coluna + 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                };
            };
            // ---------------------------------------------------- Pra Direita e Pra Baixo ----------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna + 2) < LTM && TB[(linha + 1)][(coluna + 2)] === "") {
                TB[(linha + 1)].splice((coluna + 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha + 1) < LTM && (coluna + 2) < LTM && TB[linha + 1][coluna + 2] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 1)}${(coluna + 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                }
            }
            // ---------------------------------------------------- Pra Esquerda e Pra Cima ----------------------------------------------------------- //
            if ((linha - 1) >= 0 && (coluna - 2) >= 0 && TB[(linha - 1)][(coluna - 2)] === "") {
                TB[(linha - 1)].splice((coluna - 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha - 1) >= 0 && (coluna - 2) >= 0 && TB[(linha - 1)][(coluna - 2)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha - 1)}${(coluna - 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                }
            }
            // ---------------------------------------------------- Pra Esquerda e Pra Baixo ----------------------------------------------------------- //
            if ((linha + 1) < LTM && (coluna - 2) >= 0 && TB[(linha + 1)][(coluna - 2)] === "") {
                TB[(linha + 1)].splice((coluna - 2), 1, "▪");
            } else {
                for (let num = 0; num < pecasP.length; num++) {
                    if ((linha + 1) < LTM && (coluna - 2) >= 0 && TB[(linha + 1)][(coluna - 2)] === pecasP[num].conteudo) {
                        document.querySelector(`.casa_${(linha + 1)}${(coluna - 2)}`).style.cssText = "background-color: red; cursor: pointer;"
                    };
                }
            }
        };
    },
    (torre) => {
        const linha = parseInt(torre.className.slice(-2, -1));
        const coluna = parseInt(torre.className.slice(-1));
        const LTM = TB.length;
        let D = 0; let E = 0; let C = 0; let B = 0;
        if (torre.textContent === pecasP[5].conteudo) {
            for (let num = 1; num < LTM; num++) {
                // ------------------------------------------------------------------- PRA CIMA -----------------------------------------------------
                if ((linha - num) >= 0 && TB[(linha - num)][coluna] === "" && C === 0) {
                    TB[(linha - num)].splice(coluna, 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && TB[(linha - num)][coluna] === pecasP[p].conteudo && C === 0) {
                            C = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && TB[(linha - num)][coluna] === pecasB[b].conteudo && C === 0) {
                            document.querySelector(`.casa_${(linha - num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;";
                            C = 1;
                        };
                    };
                };
                // ------------------------------------------------------------------- PRA BAIXO -----------------------------------------------------
                if ((linha + num) < LTM && TB[(linha + num)][coluna] === "" && B === 0) {
                    TB[(linha + num)].splice(coluna, 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && TB[(linha + num)][coluna] === pecasP[p].conteudo && B === 0) {
                            B = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && TB[(linha + num)][coluna] === pecasB[b].conteudo && B === 0) {
                            document.querySelector(`.casa_${(linha + num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;";
                            B = 1;
                        };
                    };
                };
                // ------------------------------------------------------------------ PRA ESQUERDA ---------------------------------------------------
                if ((coluna - num) >= 0 && TB[linha][(coluna - num)] === "" && E === 0) {
                    TB[linha].splice((coluna - num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna - num) >= 0 && TB[linha][(coluna - num)] === pecasP[p].conteudo && E === 0) {
                            E = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna - num) >= 0 && TB[linha][(coluna - num)] === pecasB[b].conteudo && E === 0) {
                            document.querySelector(`.casa_${linha}${(coluna - num)}`).style.cssText = "cursor: pointer ;background-color: red;";
                            E = 1;
                        };
                    };
                };
                // ----------------------------------------------------------------- PRA DIREITA, COLUNA -----------------------------------------------
                if ((coluna + num) < LTM && TB[linha][(coluna + num)] === "" && D === 0) {
                    TB[linha].splice((coluna + num), 1, "▪");
                } else {
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna + num) < LTM && TB[linha][(coluna + num)] === pecasP[p].conteudo && D === 0) {
                            D = 1;
                        };
                    };
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna + num) < LTM && TB[linha][(coluna + num)] === pecasB[b].conteudo && D === 0) {
                            document.querySelector(`.casa_${linha}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;";
                            D = 1;
                        };
                    };
                };
            };
        };
        if (torre.textContent === pecasB[5].conteudo) {
            for (let num = 1; num < LTM; num++) {
                // ----------------------------------- PRA CIMA, LINHA - 1 --------------------------
                if ((linha - num) >= 0 && TB[(linha - num)][coluna] === "" && C === 0) {
                    TB[(linha - num)].splice(coluna, 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha - num) >= 0 && TB[(linha - num)][coluna] === pecasB[b].conteudo && C === 0) {
                            C = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha - num) >= 0 && TB[(linha - num)][coluna] === pecasP[p].conteudo && C === 0) {
                            document.querySelector(`.casa_${(linha - num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;";
                            C = 1;
                        };
                    };
                };
                // ----------------------------------- PRA BAIXO, LINHA + 1 -------------------------
                if ((linha + num) < LTM && TB[(linha + num)][coluna] === "" && B === 0) {
                    TB[(linha + num)].splice(coluna, 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((linha + num) < LTM && TB[(linha + num)][coluna] === pecasB[b].conteudo && B === 0) {
                            B = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((linha + num) < LTM && TB[(linha + num)][coluna] === pecasP[p].conteudo && B === 0) {
                            document.querySelector(`.casa_${(linha + num)}${coluna}`).style.cssText = "background-color: red; cursor: pointer;";
                            B = 1;
                        };
                    };
                };
                // ----------------------------------- PRA ESQUERDA, COLUNA - 1 ---------------------
                if ((coluna - num) >= 0 && TB[linha][(coluna - num)] === "" && E === 0) {
                    TB[linha].splice((coluna - num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna - num) >= 0 && TB[linha][(coluna - num)] === pecasB[b].conteudo && E === 0) {
                            E = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna - num) >= 0 && TB[linha][(coluna - num)] === pecasP[p].conteudo && E === 0) {
                            document.querySelector(`.casa_${linha}${(coluna - num)}`).style.cssText = "background-color: red; cursor: pointer;";
                            E = 1;
                        };
                    };
                };
                // ----------------------------------- PRA DIREITA, COLUNA + 1 ----------------------
                if ((coluna + num) < LTM && TB[linha][(coluna + num)] === "" && D === 0) {
                    TB[linha].splice((coluna + num), 1, "▪");
                } else {
                    for (let b = 0; b < pecasB.length; b++) {
                        if ((coluna + num) < LTM && TB[linha][(coluna + num)] === pecasB[b].conteudo && D === 0) {
                            D = 1;
                        };
                    };
                    for (let p = 0; p < pecasP.length; p++) {
                        if ((coluna + num) < LTM && TB[linha][(coluna + num)] === pecasP[p].conteudo && D === 0) {
                            document.querySelector(`.casa_${linha}${(coluna + num)}`).style.cssText = "background-color: red; cursor: pointer;";
                            D = 1;
                        };
                    };
                };
            };
        };
    }
];

function carregarTabuleiro(tabuleiro) {
    for (let linha = 0; linha < tabuleiro.length; linha++) {
        for (let coluna = 0; coluna < tabuleiro[0].length; coluna++) {
            const casa = document.createElement("div");
            casa.textContent = tabuleiro[linha][coluna];

            if (casa.textContent === pecasB[0].conteudo || casa.textContent === pecasP[0].conteudo) {
                casa.className = `casa 1 casa_${linha}${coluna}`; // Verificar Peão
            } else if (casa.textContent === pecasB[1].conteudo || casa.textContent === pecasP[1].conteudo) {
                casa.className = `casa 1 casa_${linha}${coluna}`; // Verificar Rei
            } else if (casa.textContent === pecasB[5].conteudo || casa.textContent === pecasP[5].conteudo) {
                casa.className = `casa 1 casa_${linha}${coluna}`; // Verificar Torre
            } else {
                casa.className = `casa casa_${linha}${coluna}`
            };
            if ((linha + coluna) % 2) {
                casa.style.cssText = "background-color: skyblue;"
            };
            if ((linha + coluna) % 2 === 0) {
                casa.style.cssText = "background-color: white;"
            };
            if (casa.textContent != "") {
                casa.style.cssText += " cursor: pointer;"
            };

            TH.appendChild(casa);
        };
    };
    document.querySelectorAll(".casa").forEach(peca => {
        peca.onclick = () => {
            const linha = parseInt(peca.className.slice(-2, -1));
            const coluna = parseInt(peca.className.slice(-1));
            const conteudo = peca.textContent;
            if (jogadorAtual === "Branca" && jogoON) {
                for (let num = 0; num < Regras.length; num++) {
                    if (peca.textContent === pecasB[num].conteudo) {
                        resetCores(TB);

                        casaEscolhida.Linha = linha;
                        casaEscolhida.Coluna = coluna;
                        casaEscolhida.Conteudo = conteudo;

                        if (verificarMate(TB, jogadorAtual) || num === 1) {
                            console.log("O rei está em Mate, você só pode mexer o Rei Branco");
                            Regras[1](peca);
                        } else {
                            Regras[num](peca);
                        };
                    };
                };

                if (peca.textContent === "▪" || peca.style.backgroundColor === "red") {
                    const casaAnterior = document.querySelector(`.casa_${casaEscolhida.Linha}${casaEscolhida.Coluna}`);
                    const casaAtual = document.querySelector(`.casa_${linha}${coluna}`);
                    let mov = parseInt(casaAnterior.className.slice(5, 6));

                    if (peca.style.color === "green") {
                        if (coluna === 6) { // Direita do Rei Preto
                            let torre = document.querySelector(`.casa_${linha}${coluna + 1}`);
                            let num = parseInt(torre.className.slice(5, 6));
                            TB[linha].splice((coluna + 1), 1, "");
                            TB[linha].splice((coluna - 1), 1, torre.textContent);
                            document.querySelector(`.casa_${linha}${coluna - 1}`).className = `casa ${num + 1} casa_${linha}${coluna - 1}`

                            console.log(torre, num);
                        } else if (coluna === 2) { // Esquerda do Rei Preto
                            let torre = document.querySelector(`.casa_${linha}${coluna - 2}`);
                            let num = parseInt(torre.className.slice(5, 6));
                            TB[linha].splice((coluna - 2), 1, "");
                            TB[linha].splice((coluna + 1), 1, torre.textContent);
                            document.querySelector(`.casa_${linha}${coluna + 1}`).className = `casa ${num + 1} casa_${linha}${coluna + 1}`

                            console.log(torre, num);
                        }
                    };

                    if (peca.style.color === "red" && casaEscolhida.Conteudo === pecasB[0].conteudo) {
                        let peao = document.querySelector(`.casa_${linha + 1}${coluna}`)
                        pecasMortas.push({ P: peao.textContent, M: parseInt(peao.className.slice(5, 6)), L: (linha + 1), C: coluna });
                        TB[linha + 1].splice(coluna, 1, "");
                        console.log(pecasMortas);
                    };

                    if (peca.style.backgroundColor === "red") {
                        pecasMortas.push({ P: conteudo, M: parseInt(casaAtual.className.slice(5, 6)), L: linha, C: coluna });
                        console.log(pecasMortas);
                    };
                    if (casaEscolhida.Conteudo === pecasB[0].conteudo || casaEscolhida.Conteudo === pecasB[1].conteudo || casaEscolhida.Conteudo === pecasB[5].conteudo) {
                        casaAnterior.className = `casa casa_${casaEscolhida.Linha}${casaEscolhida.Coluna}`;
                        casaAtual.className = `casa ${mov + 1} casa_${linha}${coluna}`;
                    };

                    TB[casaEscolhida.Linha].splice(casaEscolhida.Coluna, 1, "");
                    TB[linha].splice(coluna, 1, casaEscolhida.Conteudo);

                    historicoMov.push({ P: casaEscolhida.Conteudo, M: mov, ANT: { L: casaEscolhida.Linha, C: casaEscolhida.Coluna }, AT: { L: linha, C: coluna } });

                    jogadorAtual = "Preta";

                    mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;

                    resetCores(TB);
                    verificarVitória(TB);
                    salvarTabuleiro(TB);
                    verificarPromocao(TB);
                };
            } else if (jogadorAtual === "Preta" && jogoON) {
                for (let num = 0; num < Regras.length; num++) {
                    if (peca.textContent === pecasP[num].conteudo) {
                        resetCores(TB);

                        casaEscolhida.Linha = parseInt(peca.className.slice(-2, -1));
                        casaEscolhida.Coluna = parseInt(peca.className.slice(-1));
                        casaEscolhida.Conteudo = peca.textContent;

                        if (verificarMate(TB, jogadorAtual) || num === 1) {
                            console.log("O rei está em Mate, você só pode mexer o Rei Preto");
                            Regras[1](peca);
                        } else {
                            Regras[num](peca);
                        };
                    };
                };

                if (peca.textContent === "▪" || peca.style.backgroundColor === "red") {
                    const casaAnterior = document.querySelector(`.casa_${casaEscolhida.Linha}${casaEscolhida.Coluna}`);
                    const casaAtual = document.querySelector(`.casa_${linha}${coluna}`);
                    const mov = parseInt(casaAnterior.className.slice(5, 6));

                    if (peca.style.color === "green") {
                        if (coluna === 6) { // Direita do Rei Preto
                            let torre = document.querySelector(`.casa_${linha}${coluna + 1}`);
                            let num = parseInt(torre.className.slice(5, 6));
                            TB[linha].splice((coluna + 1), 1, "");
                            TB[linha].splice((coluna - 1), 1, torre.textContent);
                            document.querySelector(`.casa_${linha}${coluna - 1}`).className = `casa ${num + 1} casa_${linha}${coluna - 1}`
                        } else if (coluna === 2) { // Esquerda do Rei Preto
                            let torre = document.querySelector(`.casa_${linha}${coluna - 2}`);
                            let num = parseInt(torre.className.slice(5, 6));
                            TB[linha].splice((coluna - 2), 1, "");
                            TB[linha].splice((coluna + 1), 1, torre.textContent);
                            document.querySelector(`.casa_${linha}${coluna + 1}`).className = `casa ${num + 1} casa_${linha}${coluna + 1}`
                        };
                    };

                    if (peca.style.color === "red" && casaEscolhida.Conteudo === pecasP[0].conteudo) {
                        let peao = document.querySelector(`.casa_${linha - 1}${coluna}`)
                        pecasMortas.push({ P: peao.textContent, M: parseInt(peao.className.slice(5, 6)), L: (linha - 1), C: coluna });
                        TB[linha - 1].splice(coluna, 1, "");
                        console.log(pecasMortas);
                    };

                    if (peca.style.backgroundColor === "red") {
                        pecasMortas.push({ P: conteudo, M: parseInt(casaAtual.className.slice(5, 6)), L: linha, C: coluna });
                        console.log(pecasMortas);
                    };
                    if (casaEscolhida.Conteudo === pecasP[0].conteudo || casaEscolhida.Conteudo === pecasP[1].conteudo || casaEscolhida.Conteudo === pecasP[5].conteudo) {
                        casaAnterior.className = `casa casa_${casaEscolhida.Linha}${casaEscolhida.Coluna}`;
                        casaAtual.className = `casa ${mov + 1} casa_${linha}${coluna}`;
                    };

                    TB[casaEscolhida.Linha].splice(casaEscolhida.Coluna, 1, "");
                    TB[linha].splice(coluna, 1, casaEscolhida.Conteudo);

                    historicoMov.push({ P: casaEscolhida.Conteudo, M: mov, ANT: { L: casaEscolhida.Linha, C: casaEscolhida.Coluna }, AT: { L: linha, C: coluna } });

                    jogadorAtual = "Branca";

                    mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;

                    resetCores(TB);
                    verificarVitória(TB);
                    salvarTabuleiro(TB);
                    verificarPromocao(TB);
                };
            };
            atualizarTabuleiro(TB);
        };
    });
    reiniciar.onclick = () => {
        location.reload()
    };
    desfazer.onclick = () => {
        desfazerMovimento(historicoTB, jogoON);
    };
    inverter.onclick = () => {
        inverterTabuleiro(jogadorAtual, jogoON)
    };
};

function atualizarTabuleiro(tabuleiro) {
    for (let l = 0; l < tabuleiro.length; l++) {
        for (let c = 0; c < tabuleiro.length; c++) {
            let home = document.querySelector(`.casa_${l}${c}`);
            home.textContent = TB[l][c]
            if (home.textContent === "▪") { home.style.cssText += "cursor: pointer;" };
            if (TH.style.transform === "scaleY(-1)") { home.style.transform = "scaleY(-1)" };
        };
    };
};

function resetCores(tabuleiro) {
    for (let l = 0; l < tabuleiro.length; l++) {
        for (let c = 0; c < tabuleiro.length; c++) {
            let home = document.querySelector(`.casa_${l}${c}`);
            if ((l + c) % 2) {
                home.style.cssText = "background-color: skyblue;";
            };
            if ((l + c) % 2 === 0) {
                home.style.cssText = "background-color: white;";
            };
            if (home.textContent === "▪") {
                home.textContent = ""

                if (TB[l][c] === "▪") {
                    TB[l].splice(c, 1, "")
                }
            }
            if (home.textContent != "") {
                home.style.cssText += "cursor: pointer;";
            };
        };
    };
};

function verificarVitória(tabuleiro) {
    let verificarTB = tabuleiro.flat(1);
    if (verificarTB.includes(pecasP[1].conteudo) && verificarTB.includes(pecasB[1].conteudo)) {
        jogoON = true;
        return true;
    } else {
        if (verificarTB.includes(pecasP[1].conteudo)) {
            mensagem.textContent = "Xeque Mate! Peças Pretas ganharam!";
        };
        if (verificarTB.includes(pecasB[1].conteudo)) {
            mensagem.textContent = "Xeque Mate! Peças Brancas ganharam!"
        };
        jogoON = false;
        return false;
    };
};

function inverterTabuleiro(jogador, jogoAtivo) {
    if (jogador === "Branca" && jogoAtivo && historicoMov.length === 0) {
        jogadorAtual = "Preta";
        mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        TH.style.transform = "scaleY(-1)";
    } else if (jogador === "Preta" && jogoAtivo && historicoMov.length === 0) {
        jogadorAtual = "Branca";
        mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        TH.style.transform = "scaleY(1)";
    };
    resetCores(TB);
    atualizarTabuleiro(TB);
};

function salvarTabuleiro(tabuleiro) {
    const teste = structuredClone(tabuleiro);
    historicoTB.push(teste);
};

function desfazerMovimento(tabuleiro, jogoAtivo) {
    let mov = tabuleiro.length - 2;
    if (mov === 0 && jogoAtivo) {
        TB = tabuleiro[mov];
        historicoTB = [
            [["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
            ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
            ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]]
        ];
        historicoMov = [];
        jogadorAtual = "Branca";
        mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        for (let numL = 0; numL < TB.length; numL++) {
            for (let numC = 0; numC < TB[0].length; numC++) {
                const casa = document.querySelector(`.casa_${numL}${numC}`);
                if (TB[numL][numC] === pecasB[0].conteudo || TB[numL][numC] === pecasP[0].conteudo) {
                    casa.className = `casa 1 casa_${numL}${numC}`; // Verificar Peão
                } else if (TB[numL][numC] === pecasB[1].conteudo || TB[numL][numC] === pecasP[1].conteudo) {
                    casa.className = `casa 1 casa_${numL}${numC}`; // Verificar Rei
                } else if (TB[numL][numC] === pecasB[5].conteudo || TB[numL][numC] === pecasP[5].conteudo) {
                    casa.className = `casa 1 casa_${numL}${numC}`; // Verificar Torre
                } else {
                    casa.className = `casa casa_${numL}${numC}`
                };
            };
        };
    } else if (mov > 0 && jogoAtivo) {
        TB = historicoTB[mov];
        historicoTB.pop();

        let Casa = historicoMov[historicoMov.length - 1];
        if (Casa.P === pecasB[0].conteudo || Casa.P === pecasP[0].conteudo) {
            document.querySelector(`.casa_${Casa.AT.L}${Casa.AT.C}`).className = `casa casa_${Casa.AT.L}${Casa.AT.C}`;
            document.querySelector(`.casa_${Casa.ANT.L}${Casa.ANT.C}`).className = `casa ${Casa.M} casa_${Casa.ANT.L}${Casa.ANT.C}`;
        } else if (Casa.P === pecasB[1].conteudo || Casa.P === pecasP[1].conteudo) {
            document.querySelector(`.casa_${Casa.AT.L}${Casa.AT.C}`).className = `casa casa_${Casa.AT.L}${Casa.AT.C}`;
            document.querySelector(`.casa_${Casa.ANT.L}${Casa.ANT.C}`).className = `casa ${Casa.M} casa_${Casa.ANT.L}${Casa.ANT.C}`;
        } else if (Casa.P === pecasB[5].conteudo || Casa.P === pecasP[5].conteudo) {
            document.querySelector(`.casa_${Casa.AT.L}${Casa.AT.C}`).className = `casa casa_${Casa.AT.L}${Casa.AT.C}`;
            document.querySelector(`.casa_${Casa.ANT.L}${Casa.ANT.C}`).className = `casa ${Casa.M} casa_${Casa.ANT.L}${Casa.ANT.C}`;
        };

        if (TB[Casa.AT.L][Casa.AT.C] != "") {
            console.log(TB[Casa.AT.L][Casa.AT.C]);
            let PMs = pecasMortas[pecasMortas.length - 1];
            console.log(PMs)
            if (PMs != undefined) {
                console.log(PMs);
                console.log("Linha: " + PMs.L);
                console.log("Coluna: " + PMs.C);
                document.querySelector(`.casa_${PMs.L}${PMs.C}`).className = `casa ${PMs.M == "NaN" ? "" : PMs.M} casa_${PMs.L}${PMs.C}`;
            };
        };
        pecasMortas.pop();
        historicoMov.pop();

        if (jogadorAtual === "Branca") {
            jogadorAtual = "Preta";
            mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        } else {
            jogadorAtual = "Branca"
            mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        };
    };
    resetCores(TB);
    atualizarTabuleiro(TB);
};

function verificarPromocao(tabuleiro) {
    if (tabuleiro[0].includes(pecasB[0].conteudo)) {
        let index = tabuleiro[0].indexOf(pecasB[0].conteudo)
        if (tabuleiro[0][index] === pecasB[0].conteudo) {
            telaPromocao.style.display = "flex";
            console.log("Ok")
            document.querySelectorAll(".peca").forEach(btn => {
                if (btn.className.slice(-1) === "D") {
                    btn.textContent = pecasB[2].conteudo;
                } else if (btn.className.slice(-1) === "B") {
                    btn.textContent = pecasB[3].conteudo;
                } else if (btn.className.slice(-1) === "C") {
                    btn.textContent = pecasB[4].conteudo;
                } else {
                    btn.textContent = pecasB[5].conteudo;
                };
                btn.onclick = () => {
                    console.log(btn.textContent);
                    telaPromocao.style.display = "none";
                    TB[0][index] = btn.textContent;

                    salvarTabuleiro(TB);
                    atualizarTabuleiro(TB);
                };
            });
        };
    };
    if (tabuleiro[7].includes(pecasP[0].conteudo)) {
        telaPromocao.style.display = "flex";
        let index = tabuleiro[7].indexOf(pecasP[0].conteudo);
        if (tabuleiro[7][index] === pecasP[0].conteudo) {
            let peao = document.querySelector(`.casa_${7}${index}`);
            document.querySelectorAll(".peca").forEach(btn => {
                if (btn.className.slice(-1) === "D") {
                    btn.textContent = pecasP[2].conteudo;
                } else if (btn.className.slice(-1) === "B") {
                    btn.textContent = pecasP[3].conteudo;
                } else if (btn.className.slice(-1) === "C") {
                    btn.textContent = pecasP[4].conteudo;
                } else {
                    btn.textContent = pecasP[5].conteudo;
                };
                console.log(btn.textContent);
                btn.onclick = () => {
                    telaPromocao.style.display = "none";
                    TB[7][index] = btn.textContent;
                    pecasMortas.push({ P: peao.textContent, M: parseInt(peao.className.slice(5, 6)), L: peao.className.slice(-2, -1), C: peao.className.slice(-1) });
                    console.log(historicoMov)
                    salvarTabuleiro(TB);
                    atualizarTabuleiro(TB);
                };
            });
        };
    };
};

function verificarMate(Tabuleiro, jogador) {
    let Linha = 0;
    let Coluna = 0;
    let Limite = Tabuleiro.length;
    let C = true; let B = true; let E = true; let D = true;
    let Se = true; let Sd = true; let Ie = true; let Id = true;
    let cavalo = true;
    let Mate = false;
    if (jogador === "Branca") {
        for (let L = 0; L < Limite; L++) {
            if (Tabuleiro[L].includes(pecasB[1].conteudo)) {
                const C = Tabuleiro[L].indexOf(pecasB[1].conteudo);
                Linha = L;
                Coluna = C;
            };
        };
        for (let num = 1; num < Tabuleiro.length; num++) {
            if ((Linha - num) >= 0 && Tabuleiro[Linha - num][Coluna] != "" && C) {
                if (Tabuleiro[Linha - num][Coluna] === pecasP[1].conteudo || Tabuleiro[Linha - num][Coluna] === pecasP[2].conteudo || Tabuleiro[Linha - num][Coluna] === pecasP[5].conteudo) {
                    Mate = true;
                };
                C = false;
            };
            if ((Linha + num) < Limite && Tabuleiro[Linha + num][Coluna] != "" && B) {
                if (Tabuleiro[Linha + num][Coluna] === pecasP[1].conteudo || Tabuleiro[Linha + num][Coluna] === pecasP[2].conteudo || Tabuleiro[Linha + num][Coluna] === pecasP[5].conteudo) {
                    Mate = true;
                };
                B = false;
            };
            if ((Coluna - num) >= 0 && Tabuleiro[Linha][Coluna - num] != "" && E) {
                if (Tabuleiro[Linha][Coluna - num] === pecasP[1].conteudo || Tabuleiro[Linha][Coluna - num] === pecasP[2].conteudo || Tabuleiro[Linha][Coluna - num] === pecasP[5].conteudo) {
                    Mate = true;
                };
                E = false;
            };
            if ((Coluna + num) < Limite && Tabuleiro[Linha][Coluna + num] != "" && D) {
                if (Tabuleiro[Linha][Coluna - num] === pecasP[1].conteudo || Tabuleiro[Linha][Coluna - num] === pecasP[2].conteudo || Tabuleiro[Linha][Coluna - num] === pecasP[5].conteudo) {
                    Mate = true;
                };
                D = false;
            };

            if ((Linha - num) >= 0 && (Coluna - num) >= 0 && Tabuleiro[Linha - num][Coluna - num] != "" && Se) {
                if (Tabuleiro[Linha - num][Coluna - num] === pecasP[1].conteudo || Tabuleiro[Linha - num][Coluna - num] === pecasP[2].conteudo || Tabuleiro[Linha - num][Coluna - num] === pecasP[3].conteudo) {
                    Mate = true;
                };
                Se = false;
            };
            if ((Linha - num) >= 0 && (Coluna + num) < Limite && Tabuleiro[Linha - num][Coluna + num] != "" && Sd) {
                if (Tabuleiro[Linha - num][Coluna + num] === pecasP[1].conteudo || Tabuleiro[Linha - num][Coluna + num] === pecasP[2].conteudo || Tabuleiro[Linha - num][Coluna + num] === pecasP[3].conteudo) {
                    Mate = true;
                };
                Sd = false;
            };
            if ((Linha + num) < Limite && (Coluna - num) >= 0 && Tabuleiro[Linha + num][Coluna - num] != "" && Ie) {
                if (Tabuleiro[Linha + num][Coluna - num] === pecasP[1].conteudo || Tabuleiro[Linha + num][Coluna - num] === pecasP[2].conteudo || Tabuleiro[Linha + num][Coluna - num] === pecasP[3].conteudo) {
                    Mate = true;
                };
                Ie = false;
            };
            if ((Linha + num) < Limite && (Coluna + num) < Limite && Tabuleiro[Linha + num][Coluna + num] != "" && Id) {
                if (Tabuleiro[Linha + num][Coluna + num] === pecasP[1].conteudo || Tabuleiro[Linha + num][Coluna + num] === pecasP[2].conteudo || Tabuleiro[Linha + num][Coluna + num] === pecasP[3].conteudo) {
                    Mate = true;
                };
                Id = false;
            };

            if ((Linha - 2) >= 0 && (Coluna - 1) >= 0 && Tabuleiro[Linha - 2][Coluna - 1] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha - 2) >= 0 && (Coluna + 1) < Limite && Tabuleiro[Linha - 2][Coluna + 1] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };

            if ((Linha + 2) < Limite && (Coluna - 1) >= 0 && Tabuleiro[Linha + 2][Coluna - 1] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha + 2) < Limite && (Coluna + 1) < Limite && Tabuleiro[Linha + 2][Coluna + 1] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };

            if ((Linha - 1) >= 0 && (Coluna - 2) >= 0 && Tabuleiro[Linha - 1][Coluna - 2] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha + 1) < Limite && (Coluna - 2) >= 0 && Tabuleiro[Linha + 1][Coluna - 2] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };

            if ((Linha - 1) >= 0 && (Coluna + 2) < Limite && Tabuleiro[Linha - 1][Coluna + 2] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha + 1) < Limite && (Coluna + 2) < Limite && Tabuleiro[Linha + 1][Coluna + 2] === pecasP[4].conteudo && cavalo) {
                cavalo = false;
            };
        };
        if (Mate) {
            console.log("Rei Branco está em Mate!");
            console.log(Mate);
            return Mate
        } else {
            console.log("Rei Branco está Livre!");
            console.log(Mate);
            return Mate
        };
    } else {
        for (let L = 0; L < Limite; L++) {
            if (Tabuleiro[L].includes(pecasP[1].conteudo)) {
                const C = Tabuleiro[L].indexOf(pecasP[1].conteudo);
                Linha = L;
                Coluna = C;
            };
        };
        for (let num = 1; num < Tabuleiro.length; num++) {
            if ((Linha - num) >= 0 && Tabuleiro[Linha - num][Coluna] != "" && C) {
                if (Tabuleiro[Linha - num][Coluna] === pecasB[1].conteudo || Tabuleiro[Linha - num][Coluna] === pecasB[2].conteudo || Tabuleiro[Linha - num][Coluna] === pecasB[5].conteudo) {
                    Mate = true;
                };
                C = false;
            };
            if ((Linha + num) < Limite && Tabuleiro[Linha + num][Coluna] != "" && B) {
                if (Tabuleiro[Linha + num][Coluna] === pecasB[1].conteudo || Tabuleiro[Linha + num][Coluna] === pecasB[2].conteudo || Tabuleiro[Linha + num][Coluna] === pecasB[5].conteudo) {
                    Mate = true;
                };
                B = false;
            };
            if ((Coluna - num) >= 0 && Tabuleiro[Linha][Coluna - num] != "" && E) {
                if (Tabuleiro[Linha][Coluna - num] === pecasB[1].conteudo || Tabuleiro[Linha][Coluna - num] === pecasB[2].conteudo || Tabuleiro[Linha][Coluna - num] === pecasB[5].conteudo) {
                    Mate = true;
                };
                E = false;
            };
            if ((Coluna + num) < Limite && Tabuleiro[Linha][Coluna + num] != "" && D) {
                if (Tabuleiro[Linha][Coluna - num] === pecasB[1].conteudo || Tabuleiro[Linha][Coluna - num] === pecasB[2].conteudo || Tabuleiro[Linha][Coluna - num] === pecasB[5].conteudo) {
                    Mate = true;
                };
                D = false;
            };

            if ((Linha - num) >= 0 && (Coluna - num) >= 0 && Tabuleiro[Linha - num][Coluna - num] != "" && Se) {
                if (Tabuleiro[Linha - num][Coluna - num] === pecasB[1].conteudo || Tabuleiro[Linha - num][Coluna - num] === pecasB[2].conteudo || Tabuleiro[Linha - num][Coluna - num] === pecasB[3].conteudo) {
                    Mate = true;
                };
                Se = false;
            };
            if ((Linha - num) >= 0 && (Coluna + num) < Limite && Tabuleiro[Linha - num][Coluna + num] != "" && Sd) {
                if (Tabuleiro[Linha - num][Coluna + num] === pecasB[1].conteudo || Tabuleiro[Linha - num][Coluna + num] === pecasB[2].conteudo || Tabuleiro[Linha - num][Coluna + num] === pecasB[3].conteudo) {
                    Mate = true;
                };
                Sd = false;
            };
            if ((Linha + num) < Limite && (Coluna - num) >= 0 && Tabuleiro[Linha + num][Coluna - num] != "" && Ie) {
                if (Tabuleiro[Linha + num][Coluna - num] === pecasB[1].conteudo || Tabuleiro[Linha + num][Coluna - num] === pecasB[2].conteudo || Tabuleiro[Linha + num][Coluna - num] === pecasB[3].conteudo) {
                    Mate = true;
                };
                Ie = false;
            };
            if ((Linha + num) < Limite && (Coluna + num) < Limite && Tabuleiro[Linha + num][Coluna + num] != "" && Id) {
                if (Tabuleiro[Linha + num][Coluna + num] === pecasB[1].conteudo || Tabuleiro[Linha + num][Coluna + num] === pecasB[2].conteudo || Tabuleiro[Linha + num][Coluna + num] === pecasB[3].conteudo) {
                    Mate = true;
                };
                Id = false;
            };

            if ((Linha - 2) >= 0 && (Coluna - 1) >= 0 && Tabuleiro[Linha - 2][Coluna - 1] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha - 2) >= 0 && (Coluna + 1) < Limite && Tabuleiro[Linha - 2][Coluna + 1] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };

            if ((Linha + 2) < Limite && (Coluna - 1) >= 0 && Tabuleiro[Linha + 2][Coluna - 1] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha + 2) < Limite && (Coluna + 1) < Limite && Tabuleiro[Linha + 2][Coluna + 1] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };

            if ((Linha - 1) >= 0 && (Coluna - 2) >= 0 && Tabuleiro[Linha - 1][Coluna - 2] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha + 1) < Limite && (Coluna - 2) >= 0 && Tabuleiro[Linha + 1][Coluna - 2] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };

            if ((Linha - 1) >= 0 && (Coluna + 2) < Limite && Tabuleiro[Linha - 1][Coluna + 2] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };
            if ((Linha + 1) < Limite && (Coluna + 2) < Limite && Tabuleiro[Linha + 1][Coluna + 2] === pecasB[4].conteudo && cavalo) {
                cavalo = false;
            };
        };
        if (Mate) {
            console.log("Rei Preto está em Mate!");
            console.log(Mate);
            return Mate
        } else {
            console.log("Rei Preto está Livre!");
            console.log(Mate);
            return Mate
        };
    };
};

carregarTabuleiro(TB);