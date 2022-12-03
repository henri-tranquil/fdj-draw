const fs = require("fs");

class CSVParser {
  constructor(url) {
    this.data = fs.readFileSync(url, {
      encoding: "utf8",
      flag: "r",
    });

    this._analyseCSV();
  }

  _analyseCSV() {
    const res = [];
    this.data = this.data.split("\n");
    for (let i = 1; i < this.data.length; i++) {
      const line = this.data[i].split(";");
      if (line.length > 2) {
        res.push(this._analyseElement(line));
      }
    }
    this.parsedData = res;
  }

  _analyseElement(element) {
    const date = element[2];
    let newDate = "";
    let boules = [];
    let etoiles = [];

    if (date.length === 10) {
      const dateTable = date.split("/");
      newDate = `${dateTable[2]}-${dateTable[1]}-${dateTable[0]}Z20:00:00.000Z`;
      if (element[4].indexOf("/") === -1) {
        boules = [
          Number.parseInt(element[4]),
          Number.parseInt(element[5]),
          Number.parseInt(element[6]),
          Number.parseInt(element[7]),
          Number.parseInt(element[8]),
        ];
        etoiles = [Number.parseInt(element[9]), Number.parseInt(element[10])];
      } else {
        boules = [
          Number.parseInt(element[5]),
          Number.parseInt(element[6]),
          Number.parseInt(element[7]),
          Number.parseInt(element[8]),
          Number.parseInt(element[9]),
        ];
        etoiles = [Number.parseInt(element[10]), Number.parseInt(element[11])];
      }
    }
    if (date.length === 8 && date.indexOf("/") === -1) {
      newDate = `${date.substring(0, 4)}-${date.substring(
        4,
        6
      )}-${date.substring(6, 8)}Z20:00:00.000Z`;
      if (element[4].indexOf("/") === -1) {
        boules = [
          Number.parseInt(element[4]),
          Number.parseInt(element[5]),
          Number.parseInt(element[6]),
          Number.parseInt(element[7]),
          Number.parseInt(element[8]),
        ];
        etoiles = [Number.parseInt(element[9]), Number.parseInt(element[10])];
      } else {
        boules = [
          Number.parseInt(element[5]),
          Number.parseInt(element[6]),
          Number.parseInt(element[7]),
          Number.parseInt(element[8]),
          Number.parseInt(element[9]),
        ];
        etoiles = [Number.parseInt(element[10]), Number.parseInt(element[11])];
      }
    }

    if (date.length === 8 && date.indexOf("/") !== -1) {
      newDate = `20${date.substring(6, 8)}-${date.substring(
        3,
        5
      )}-${date.substring(0, 2)}Z20:00:00.000Z`;
      if (element[4].indexOf("/") === -1) {
        boules = [
          Number.parseInt(element[4]),
          Number.parseInt(element[5]),
          Number.parseInt(element[6]),
          Number.parseInt(element[7]),
          Number.parseInt(element[8]),
        ];
        etoiles = [Number.parseInt(element[9]), Number.parseInt(element[10])];
      } else {
        boules = [
          Number.parseInt(element[5]),
          Number.parseInt(element[6]),
          Number.parseInt(element[7]),
          Number.parseInt(element[8]),
          Number.parseInt(element[9]),
        ];
        etoiles = [Number.parseInt(element[10]), Number.parseInt(element[11])];
      }
    }
    return {
      date: new Date(newDate).toISOString(),
      boules,
      etoiles,
    };
  }
  getDatas() {
    return this.parsedData;
  }
}
module.exports = CSVParser;
