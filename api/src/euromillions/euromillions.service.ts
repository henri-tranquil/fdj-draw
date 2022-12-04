import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { Euromillions } from './euromillions.dto';
import axios from 'axios';

const RESOURCES_FOLDER = '../resources';

const DISCORD_CONFIG = {
  method: 'POST',
  url: 'https://discord.com/api/webhooks/1047987192607297566/I_zC3Wma4bLuwDxleVzwreGhkWqQrRdqg7ATJOdIIoUJudX5-G0cAeMUTt8Yvq81O95V',
  headers: { 'Content-Type': 'application/json' },
};

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
              name: `Balls :`,
              value: `${this.getLatest().balls.join(', ')}`,
            },
            {
              name: `Stars :`,
              value: `${this.getLatest().stars.join(', ')}`,
            },
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
