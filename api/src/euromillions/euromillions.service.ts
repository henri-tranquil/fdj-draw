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
      console.log('FILE HAS CHANGED');
      this.latestHash = hash;
      this.data = JSON.parse(bufferedFile);
      const embeds = [
        {
          title: 'Euromillions Data updated',
          fields: [
            {
              name: `Draw of ${new Date().toLocaleString()}`,
              value: this.getLatest(),
            },
          ],
        },
      ];
      DISCORD_CONFIG['data'] = JSON.stringify({ embeds });
      console.log('CONFIG :', DISCORD_CONFIG);
      axios(DISCORD_CONFIG)
        .then((response) => {
          console.log('Webhook delivered successfully');
          return response;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    }
  }
}
