import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { Euromillions } from './euromillions.dto';
import axios from 'axios';
import { env } from 'process';

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
  constructor() {
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
      const embeds = [
        {
          title: `New Draw : ${new Date().toLocaleString()}`,
          fields: [
            {
              name: `Latest Draw`,
              value: this._formatDraw(this.getLatest()),
            }
          ],
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
