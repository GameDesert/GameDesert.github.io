import _ from 'lodash';

import {Simulation} from './simulation';
import {EPSILON_DETECTION} from './const';

export class WinningStatus {

  constructor(tileMatrix) {
    this.tileMatrix = tileMatrix;
  }

  run() {
    const simulationC = new Simulation(this.tileMatrix);
    simulationC.initialize();
    simulationC.propagateToEnd(false);

    this.absorptionProbabilities = _(simulationC.measurementHistory)
      .flatten()
      .groupBy((entry) => `${entry.i} ${entry.j}`)
      .mapValues((groupedEntry) =>
        _.sumBy(groupedEntry, 'probability')
      )
      .map((probability, location) => ({
        probability: probability,
        i: parseInt(location.split(' ')[0]),
        j: parseInt(location.split(' ')[1]),
      }))
      .value();

    this.probsAtDets = _(this.absorptionProbabilities)
      .filter((entry) => _.get(this.tileMatrix, `[${entry.i}][${entry.j}].isDetector`))
      .map('probability')
      .value();

    this.probsAtDetsByTime = _.map(simulationC.measurementHistory, (each) =>
      _(each)
        .filter((entry) => _.get(this.tileMatrix, `[${entry.i}][${entry.j}].isDetector`))
        .sumBy('probability')
    );

    this.totalProbAtDets = _.sum(this.probsAtDets);
    this.noOfFedDets = this.probsAtDets
      .filter((probability) => probability > EPSILON_DETECTION)
      .length;
    this.probsAtMines = _(this.absorptionProbabilities)
      .filter((entry) =>
        this.tileMatrix[entry.i] && this.tileMatrix[entry.i][entry.j] && this.tileMatrix[entry.i][entry.j].tileName === 'Mine'
      )
      .sumBy('probability');
  }

  compareToObjectives(requiredDetectionProbability, detectorsToFeed) {
    this.enoughProbability = this.totalProbAtDets > requiredDetectionProbability - EPSILON_DETECTION;
    this.enoughDetectors = this.noOfFedDets >= detectorsToFeed;
    this.noExplosion = this.probsAtMines < EPSILON_DETECTION;
    this.isWon = this.enoughProbability && this.enoughDetectors && this.noExplosion;
    const missingDets = detectorsToFeed - this.noOfFedDets;
    if (this.isWon) {
      this.message = 'You did it!';
    } else if (!this.noExplosion) {
      this.message = `Nothing else matters when you have ${(100 * this.probsAtMines).toFixed(0)}% chance of setting off a mine!`;
    } else if (this.enoughProbability) {
      this.message = `${missingDets} detector${missingDets > 1 ? 's' : ''} feel${missingDets > 1 ? '' : 's'} sad and forgotten. Be fair! Give every detector a chance!`;
    } else if (this.totalProbAtDets > EPSILON_DETECTION) {
      this.message = `Only ${(100 * this.totalProbAtDets).toFixed(0)}% (out of ${(100 * requiredDetectionProbability).toFixed(0)}%) chance of detecting a photon at a detector. Try harder!`;
    } else {
      this.message = 'No chance to detect a photon at a detector.';
    }

    return this.isWon;
  }

}
