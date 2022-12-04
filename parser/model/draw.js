const fs = require("fs");

const RESOURCES_FOLDER = "../resources";
const DEFAULT_DATA = [];

class Draw {
  name;
  path;
  data;

  constructor(name, template = DEFAULT_DATA) {
    this.name = name;
    this.path = `${RESOURCES_FOLDER}/${name}.json`;
    if (!fs.existsSync(RESOURCES_FOLDER)) {
      fs.mkdirSync(RESOURCES_FOLDER);
    }

    if (!fs.existsSync(this.path)) {
      fs.appendFileSync(this.path, JSON.stringify(template), {
        encoding: "utf8",
      });
      this.data = template;
    } else {
      this.data = JSON.parse(
        fs.readFileSync(this.path, {
          encoding: "utf8",
          flag: "r",
        })
      );
    }
  }

  getData() {
    return this.data;
  }

  addData(data) {
    this.data = this.data.concat(data);
    this._orderData();
    this._removeData();
    this.saveData();

    return this.data;
  }

  _orderData() {
    this.data.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  _removeData() {
    this.data = this.data.filter((value, index, self) => {
      const i = self.findIndex((t) => t.date === value.date);
      return i === index;
    });
  }

  saveData() {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

module.exports = Draw;
