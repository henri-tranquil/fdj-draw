import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { Euromillions } from './euromillions.dto';

const RESOURCES_FOLDER = '../resources';

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
    }
  }
}
