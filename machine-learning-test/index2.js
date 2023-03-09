const axios = require("axios");
const brain = require('brain.js');

const NB_DRAW = 10;
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

console.log("#### START PROGRAM ####");
axios.get("http://51.158.70.5:80/euromillions/all").then((response) => {
    const net = new brain.NeuralNetwork();

    const allDraw = response.data.data.reverse();
    const trainingData = [];

    for (let i = 0; i < allDraw.length - 1 - NB_DRAW; i++) {

        //const last_1 = allDraw[i - 1].balls;
        n_last = getNList(allDraw, i, i + NB_DRAW);


        const last = allDraw[i + NB_DRAW].balls.sort();
        trainingData.push({
            input: n_last,
            output: formatOuput(last)
        });
    }

    console.log("BEGIN TRAIN...");
    net.train(trainingData);
    console.log("END TRAIN...");


    console.log("TRAINING :", trainingData[trainingData.length - 1])

    const last_draw = getNList(allDraw, allDraw.length - 2 - NB_DRAW, allDraw.length - 2);
    console.log("DRAW :", last_draw)

    const output = net.run(last_draw);
    console.log("OUTPUT :", output);


    console.log("#### END PROGRAM ####");
})

function getNList(draw, start, end) {
    return draw.slice(start, end).map((element) => {
        return element.balls.sort();
        //return asciiEncrypt(element.balls.sort());
    });
}

function listOfListStringified(list) {
    list = list.map((element) => {
        return element.sort().join("");
    });
    return list.join("\n");
}

function asciiEncrypt(list) {
    const res = [];
    for (const num of list) {
        res.push(ALPHABET[num - 1]);
    }
    return res;
}
function asciiDecrypt(string) {
    const result = [];
    for (const letter of string) {
        result.push(ALPHABET.indexOf(letter) + 1);
    }
}

function formatOuput(list) {
    const res = {};
    for (let index = 0; index < 50; index++) {
        res[(index + 1).toString()] = 0;
    }
    for (const num of list) {
        res[num] = 1;
    }
    return res;
}

