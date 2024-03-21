import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { Euromillions } from './euromillions.dto';
import axios from 'axios';
import { env } from 'process';
import { MLService } from 'src/services/ml/ml.service';

const RESOURCES_FOLDER = '../resources';

const DISCORD_CONFIG = {
  method: 'POST',
  url: env.DISCORD,
  headers: { 'Content-Type': 'application/json' },
};

console.log(DISCORD_CONFIG);

@Injectable()
export class EuromillionsService {
  data: Euromillions[];
  latestHash: string;
  constructor(private _mlService: MLService) {
    console.log('PWD :', process.env.PWD);
    this.loadFile();
    setInterval(() => {
      this.loadFile();
    }, 1000 * 60);
  }

  getAll() {
    this.loadFile();
    return this.data;
  }

  getLatest() {
    this.loadFile();
    return this.data[0];
  }

  checkIfExist(balls: string[]) {
    balls = balls.sort();
    for (const draw of this.data) {
      if (draw.balls.sort().toString() == balls.toString()) {
        return draw.date;
      }
    }
    return false;
  }

  private _processData(dataset) {
    const data = [...dataset].reverse();

    return data.map((d) => {
      const date = new Date(d.date);
      const balls = d.balls
        .map((n) => parseInt(n.toString()))
        .sort(function (a, b) {
          return a - b;
        });
      const stars = d.stars
        .map((s) => parseInt(s.toString()))
        .sort(function (a, b) {
          return a - b;
        });
      return { ...d, date, balls, stars };
    });
  }

  private _formatDraw(draw) {
    return `:yellow_circle: ${draw.balls.join(
      ', ',
    )}\n :star:  ${draw.stars.join(', ')}`;
  }

  loadFile() {
    const bufferedFile = readFileSync(RESOURCES_FOLDER + '/euromillions.json', {
      encoding: 'utf8',
      flag: 'r',
    });
    const hashSum = createHash('sha256');
    hashSum.update(bufferedFile);
    const hash = hashSum.digest('hex');
    if (hash !== this.latestHash) {
      this.latestHash = hash;
      this.data = JSON.parse(bufferedFile);
      const processedData = this._processData(this.data);
      this._mlService.train(processedData);
      const lastDraw = processedData[processedData.length - 1];
      const previousDrawEstimation = this._mlService.lastEstimation;
      const nextDraw = this._mlService.predictNext(
        lastDraw.balls,
        lastDraw.stars,
      );
      const fields = [];
      if (previousDrawEstimation != null) {
        fields.push({
          name: `Previous Estimated Draw`,
          value: this._formatDraw(previousDrawEstimation),
        });
      }

      fields.push({
        name: `Latest Draw`,
        value: this._formatDraw(this.getLatest()),
      });
      fields.push({
        name: `Next Estimated Draw`,
        value: this._formatDraw(nextDraw),
      });
      const embeds = [
        {
          title: `Euromillion draw from : ${new Date().toLocaleDateString(
            'FR-fr',
          )}`,
          fields,
        },
      ];
      DISCORD_CONFIG['data'] = JSON.stringify({ embeds });
      axios(DISCORD_CONFIG)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
  }
}
