let TB = [
    ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

const TH = document.getElementById("tabuleiro");
TH.style.cssText = `
grid-template-columns: repeat(${TB[0].length}, 50px);
grid-template-rows: repeat(${TB.length}, 50px);
`;

const mensagem = document.getElementById("vez");
const reiniciar = document.getElementById("reiniciar");
const desfazer = document.getElementById("desfazer");
const sla = document.getElementById("sla");
const telaPromocao = document.getElementById("promover");
const escolherPromocao = document.querySelectorAll(".peca");

let historicoTB = [];
historicoTB.push(
    [["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]]
);

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
            } else if ((coluna - 1) >= 0 && (TB[linha][(coluna - 1)] === pecasB[0].conteudo || TB[linha][(coluna - 1)] === pecasB[1].conteudo || TB[linha][(coluna - 1)] === pecasB[2].conteudo || TB[linha][(coluna - 1)] === pecasB[3].conteudo || TB[linha][(coluna - 1)] === pecasB[4].conteudo || TB[linha][(coluna - 1)] === pecasB[5].conteudo)) {
                document.querySelector(`.casa_${linha}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((coluna + 1) < LTM && TB[linha][coluna + 1] === "") {  // PRA DIREITA
                TB[linha].splice((coluna + 1), 1, "▪");
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
            } else if ((coluna - 1) >= 0 && (TB[linha][(coluna - 1)] === pecasP[0].conteudo || TB[linha][(coluna - 1)] === pecasP[1].conteudo || TB[linha][(coluna - 1)] === pecasP[2].conteudo || TB[linha][(coluna - 1)] === pecasP[3].conteudo || TB[linha][(coluna - 1)] === pecasP[4].conteudo || TB[linha][(coluna - 1)] === pecasP[5].conteudo)) {
                document.querySelector(`.casa_${linha}${coluna - 1}`).style.cssText = "background-color: red; cursor: pointer;"
            };
            // ----------------------------------------------------------------------------------------------------------------------------------------- //
            if ((coluna + 1) < LTM && TB[linha][coluna + 1] === "") {  // PRA DIREITA
                TB[linha].splice((coluna + 1), 1, "▪");
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

let jogadorAtual = "Branca";
let jogoON = true;
let casaEscolhida = {
    Linha: "",
    Coluna: "",
    Conteudo: ""
};

function carregarTabuleiro() {
    for (let linha = 0; linha < TB.length; linha++) {
        for (let coluna = 0; coluna < TB[0].length; coluna++) {
            const casa = document.createElement("div");
            casa.textContent = TB[linha][coluna];

            if (casa.textContent === pecasB[0].conteudo || casa.textContent === pecasP[0].conteudo) {
                casa.className = `casa 1 casa_${linha}${coluna}`;
            } else {
                casa.className = `casa casa_${linha}${coluna}`;
            };
            if ((linha + coluna) % 2) { casa.style.cssText = "background-color: skyblue;" };
            if ((linha + coluna) % 2 === 0) { casa.style.cssText = "background-color: white;" };
            if (casa.textContent != "") { casa.style.cssText += " cursor: pointer;" };

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

                        Regras[num](peca);
                    };
                };

                if (peca.textContent === "▪" || peca.style.cssText.slice(0, 22) === "background-color: red;") {
                    TB[linha].splice(coluna, 1, casaEscolhida.Conteudo);

                    TB[casaEscolhida.Linha].splice(casaEscolhida.Coluna, 1, "");

                    jogadorAtual = "Preta";

                    mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;

                    /* if (verificarVitória(TB)) { inverterTabuleiro(jogadorAtual, jogoON) }; */

                    resetCores(TB);
                    verificarVitória(TB);
                    salvarTabuleiro(TB);
                };
            } else if (jogadorAtual === "Preta" && jogoON) {
                for (let num = 0; num < Regras.length; num++) {
                    if (peca.textContent === pecasP[num].conteudo) {
                        resetCores(TB);

                        casaEscolhida.Linha = parseInt(peca.className.slice(-2, -1));
                        casaEscolhida.Coluna = parseInt(peca.className.slice(-1));
                        casaEscolhida.Conteudo = peca.textContent;

                        Regras[num](peca);
                    };
                };

                if (peca.textContent === "▪" || peca.style.cssText.slice(0, 22) === "background-color: red;") {
                    TB[linha].splice(coluna, 1, casaEscolhida.Conteudo);

                    TB[casaEscolhida.Linha].splice(casaEscolhida.Coluna, 1, "");

                    jogadorAtual = "Branca";

                    mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;

                    /* if (verificarVitória(TB)) { inverterTabuleiro(jogadorAtual, jogoON) }; */

                    resetCores(TB);
                    verificarVitória(TB);
                    salvarTabuleiro(TB);
                };
            };
            atualizarTabuleiro(TB);
        };
    });
    reiniciar.onclick = () => {
        TB = [
            ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
            ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
            ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
        ];
        jogadorAtual = "Branca";
        mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        resetCores(TB);
        atualizarTabuleiro(TB);
    };
    desfazer.onclick = () => {
        desfazerMovimento(historicoTB, jogoON);
    };
    sla.onclick = () => {
        if(TB[0].includes(pecasB[0].conteudo)) {
            telaPromocao.style.display = "flex";
        };
        if(TB[7].includes(pecasP[0].conteudo)) {
            telaPromocao.style.display = "flex";
        };
    };
    escolherPromocao.forEach(btn => {
        btn.onclick = () => {
            console.log(btn.textContent)
            telaPromocao.style.display = "none"
        }
    });
};


function atualizarTabuleiro(tabuleiro) {
    for (let l = 0; l < tabuleiro.length; l++) {
        for (let c = 0; c < tabuleiro.length; c++) {
            let home = document.querySelector(`.casa_${l}${c}`);
            home.textContent = TB[l][c]
            if (home.textContent === "▪") { home.style.cssText += "cursor: pointer;" }
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
    if (jogador === "Branca" && jogoAtivo) {
        TH.style.transform = "scaleY(1)";
    } else if (jogador === "Preta" && jogoAtivo) {
        TH.style.transform = "scaleY(-1)";
        document.querySelectorAll(".casa").forEach(c => {
            c.style.transform = "scaleY(-1)"
        });
    };
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
        jogadorAtual = "Branca";
        mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
    } else if (mov > 0 && jogoAtivo) {
        TB = historicoTB[mov];
        historicoTB.pop();
        if (jogadorAtual === "Branca") {
            jogadorAtual = "Preta";
            mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        } else {
            jogadorAtual = "Branca"
            mensagem.textContent = `Vez das Peças ${jogadorAtual}s`;
        };
    };
    /* inverterTabuleiro(jogadorAtual, jogoON); */
    resetCores(TB);
    atualizarTabuleiro(TB);
};

carregarTabuleiro();

