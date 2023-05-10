import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { Euromillions } from './euromillions.dto';
import axios from 'axios';
import { env } from 'process';
import { NeuralNetwork } from 'brain.js';

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

  predictNext() {
    const data = [...this.data].reverse();

    const processedData = data.map((d) => {
      const date = new Date(d.date);
      const balls = d.balls.map((n) => parseInt(n.toString()));
      const stars = d.stars.map((s) => parseInt(s.toString()));
      return { ...d, date, balls, stars };
    });

    // Préparer les données d'entraînement
    const trainingBallsData = [];
    const trainingstarsData = [];
    for (let i = 1; i < processedData.length; i++) {
      const element = processedData[i];
      const last = processedData[i - 1];
      const input_balls = this._generateOutput(last.balls);
      const input_stars = this._generateOutput(last.stars, true);
      const output_balls = this._generateOutput(element.balls);
      const output_stars = this._generateOutput(element.stars, true);
      trainingBallsData.push({ input: input_balls, output: output_balls });
      trainingstarsData.push({ input: input_stars, output: output_stars });
    }
    console.log('INITIALISE NETWORK');

    // Configurer le réseau de neurones
    const net_balls = new NeuralNetwork({
      hiddenLayers: [5, 3],
    });

    const net_stars = new NeuralNetwork({
      hiddenLayers: [5, 3],
    });

    console.log('TRAIN NETWORK...');

    // Entraîner le réseau de neurones
    net_balls.train(trainingBallsData);
    net_stars.train(trainingstarsData);

    // Utiliser le réseau de neurones pour prédire les numéros du prochain tirage
    const previousNumbersBalls = this._generateOutput(
      processedData[processedData.length - 1].balls,
    );
    const previousNumbersStars = this._generateOutput(
      processedData[processedData.length - 1].stars,
      true,
    );
    const input_balls = previousNumbersBalls;
    const input_stars = previousNumbersStars;

    const output_balls = net_balls.run(input_balls);
    const output_stars = net_stars.run(input_stars);
    const result = {
      balls: this._getBestFromResult(output_balls).sort(),
      stars: this._getBestFromResult(output_stars, true).sort(),
    };
    console.log('TRAINING FINISHED');

    return result;
  }

  _generateOutput(balls, is_stars = false) {
    const nb_balls = is_stars ? 12 : 50;
    const generatedOutput = {};
    for (let i = 0; i < nb_balls; i++) {
      generatedOutput[`b${(i + 1).toString()}`] = 0;
    }

    for (const ball of balls) {
      generatedOutput[`b${ball.toString()}`] = 1;
    }
    return generatedOutput;
  }

  _getBestFromResult(results, is_stars = false) {
    const nb_element = is_stars ? 2 : 5;
    const sortedPairs = Object.entries(results).sort(
      (a: any, b: any) => b[1] - a[1],
    );

    const sortedObj = Object.fromEntries(sortedPairs);
    const best = Object.keys(sortedObj).slice(0, nb_element);
    return best.map((e) => parseInt(e.substring(1)));
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
      const nextDraw = this.predictNext();
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
        {
          title: 'Expected next draw',
          fields: [
            {
              name: `Balls :`,
              value: `${nextDraw.balls.join(', ')}`,
            },
            {
              name: `Stars :`,
              value: `${nextDraw.stars.join(', ')}`,
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
