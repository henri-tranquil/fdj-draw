import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Euromillions } from './euromillions.dto';

const RESOURCES_FOLDER = './resources';

@Injectable()
export class EuromillionsService {
  data: Euromillions[];
  constructor() {
    this.data = JSON.parse(
      fs.readFileSync(RESOURCES_FOLDER + '/euromillions.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  getAll() {
    return this.data;
  }

  getLatest() {
    return this.data[0];
  }
}
