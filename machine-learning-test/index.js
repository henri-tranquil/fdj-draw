const axios = require("axios");
const brain = require('brain.js');

const NB_DRAW = 10;

const test = [
    [20, 25, 27, 26, 12],
    [8, 46, 31, 27, 50],
    [30, 3, 12, 26, 9],
    [2, 15, 44, 35, 19],
    [1, 20, 11, 17, 27],
    [16, 17, 26, 23, 35],
    [33, 31, 19, 34, 43],
    [48, 42, 17, 34, 47],
    [20, 29, 21, 46, 45],
    [16, 31, 35, 44, 45]
]


console.log("#### START PROGRAM ####");
axios.get("http://51.158.70.5:80/euromillions/all").then((response) => {
    //console.log("DATA :", response.data);


    const net = new brain.NeuralNetwork();


    const allDraw = response.data.data.reverse();
    const trainingData = [];
    console.log("DATA LENGTH :", allDraw.length)

    for (let i = 0; i < allDraw.length - NB_DRAW; i++) {
        const n_last = allDraw.slice(i, i + NB_DRAW).map((element) => {
            return element.balls.sort();
        });
        //const last_1 = allDraw[i - 1].balls;

        const last = allDraw[i + NB_DRAW].balls.sort();
        trainingData.push({
            input: listOfListStringified(n_last),
            output: stringifiedList(last)
        });
    }

    console.log("TRAINING :", trainingData[trainingData.length - 1])

    net.train(trainingData);

    const last_draw = listOfListStringified(test);
    console.log("DRAW :", last_draw)

    const output = net.run(last_draw);
    console.log("OUTPUT :", output);


    console.log("#### END PROGRAM ####");
})

function listOfListStringified(list) {
    list = list.map((element) => {
        return stringifiedList(element.sort())
    });
    return list.join("\n");
}

function stringifiedList(list) {
    let result = "";
    for (const number of list) {
        result += number.toString().length === 1 ? `0${number}` : number;
    }
    return result;
}



