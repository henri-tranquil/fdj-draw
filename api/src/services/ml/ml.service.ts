import { Injectable } from '@nestjs/common';
import { NeuralNetwork } from 'brain.js';

@Injectable()
export class MLService {
  private balls_neural;
  private stars_neural;
  lastEstimation;

  train(data) {
    // Préparer les données d'entraînement
    const trainingBallsData = [];
    const trainingstarsData = [];
    for (let i = 1; i < data.length; i++) {
      const element = data[i];
      const last = data[i - 1];
      const input_balls = this._generateOutput(last.balls);
      const input_stars = this._generateOutput(last.stars, true);
      const output_balls = this._generateOutput(element.balls);
      const output_stars = this._generateOutput(element.stars, true);
      trainingBallsData.push({ input: input_balls, output: output_balls });
      trainingstarsData.push({ input: input_stars, output: output_stars });
    }
    console.log('INITIALISE NETWORK');

    // Configurer le réseau de neurones
    this.balls_neural = new NeuralNetwork({
      hiddenLayers: [5, 3],
    });

    this.stars_neural = new NeuralNetwork({
      hiddenLayers: [5, 3],
    });

    console.log('TRAIN NETWORK...');

    // Entraîner le réseau de neurones
    this.balls_neural.train(trainingBallsData);
    this.stars_neural.train(trainingstarsData);

    console.log('TRAINING FINISHED');
  }

  predictNext(balls, stars) {
    const previousNumbersBalls = this._generateOutput(balls);
    const previousNumbersStars = this._generateOutput(stars, true);
    const input_balls = previousNumbersBalls;
    const input_stars = previousNumbersStars;

    const output_balls = this.balls_neural.run(input_balls);
    const output_stars = this.stars_neural.run(input_stars);
    const result = {
      balls: this._getBestFromResult(output_balls),
      stars: this._getBestFromResult(output_stars, true),
    };
    this.lastEstimation = result;
    return result;
  }

  private _generateOutput(balls, is_stars = false) {
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

  private _getBestFromResult(results, is_stars = false) {
    const nb_element = is_stars ? 2 : 5;
    const sortedPairs = Object.entries(results).sort(
      (a: any, b: any) => b[1] - a[1],
    );

    const sortedObj = Object.fromEntries(sortedPairs);
    const best = Object.keys(sortedObj).slice(0, nb_element);
    return best.map((e) => parseInt(e.substring(1)));
  }
}
