const CSVParser = require("./model/csv-parser");
const Draw = require("./model/draw");

console.log("PROGRAM STARTED");
const lotoData = new Draw("euromillions");

console.log("DRAW DATA :", lotoData);
const csvParser = new CSVParser(`../resources/euromillions.csv`);
lotoData.addData(csvParser.getDatas());

console.log("PROGRAM ENDED");
