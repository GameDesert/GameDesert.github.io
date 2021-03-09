import _ from 'lodash';

import {Tensor} from './tensor';
import * as direction from './direction';
import * as polarization from './polarization';
import {TAU} from '../const';

/**
 * Module contains (mostly) transition probabilities.
 * Some of them are independent of tile orientation - in this case
 * the probability information is represented as tensor.
 * If there's a dependency between orientation and probability,
 * there appears a list of tensors, one for each orientation.
 */

export const identity = Tensor.product(
  direction.identity,
  polarization.identity
);

export const zero = Tensor.product(
  direction.zero,
  polarization.zero
);

const pipeH = Tensor.product(
  Tensor.sum(
    direction.diode[0],
    direction.diode[2]
  ),
  polarization.identity
);

const pipeV = Tensor.product(
  Tensor.sum(
    direction.diode[1],
    direction.diode[3]
  ),
  polarization.identity
);

const pipes = [pipeH, pipeV];

// TODO Following thing is not a Tensor.
// TODO Make it easy to distinguish types of things.
export const source = _.range(4).map((rotation) => {
  return [{
    to: `${direction.directions[rotation]}|`,
    re: 1.0,
    im: 0.0,
  }];
});

export const detector = _.range(4).map((rotation) =>
  Tensor.product(
    direction.absorbOneDirReflectOther[rotation],
    polarization.reflectPhaseFromDenser
  )
);

export const cornerCube = Tensor.product(
  direction.cube,
  polarization.identity
);

export const thinMirror = _.range(4).map((rotation) =>
  Tensor.product(
    direction.mirror[rotation],
    polarization.reflectPhaseFromDenser
  )
);

// FIX(migdal) this one is not even unitary
export const thinMirrorCoated = _.range(8).map((rotation) =>
  Tensor.product(
    direction.mirrorCoated[rotation],
    polarization.reflectPhaseFromDenser
  )
);

export const thinSplitter = _.range(4).map((rotation) =>
  Tensor.sum(
    Tensor.byConstant(
      rotation % 2 === 1 ? identity : pipes[(rotation / 2 + 1) % 2],
      {re: Math.SQRT1_2, im: 0}
    ),
    Tensor.byConstant(
      thinMirror[rotation],
      {re: 0, im: -Math.SQRT1_2}
    )
  )
);

export const thinSplitterCoated = _.range(8).map((rotation) =>
  Tensor.sum(
    Tensor.byConstant(
      rotation % 2 === 1 ? identity : pipes[(rotation / 2 + 1) % 2],
      {re: Math.SQRT1_2, im: 0}
    ),
    Tensor.byConstant(
      thinMirrorCoated[rotation],
      {re: Math.SQRT1_2, im: 0}
    )
  )
);

export const polarizingSplitter = _.range(2).map((rotation) => {
  // Convert polarizing splitter rotation (/ \) into mirror rotation (- / | \)
  const mirrorRotation = 2 * rotation + 1;
  return Tensor.fromObject(_.reduce(direction.directions, (acc, dir) => {
    const reflectedDirection = direction.planeReflectionDirection(dir, mirrorRotation);
    // Polarization - passes through
    acc[`${dir}-`] = {};
    acc[`${dir}-`][`${dir}-`] = {re: 1, im: 0};
    // Polarization | gets reflected
    acc[`${dir}|`] = {};
    acc[`${dir}|`][`${reflectedDirection}|`] = {re: 1, im: 0};
    return acc;
  }, {}));
});

// TODO check sign (?)
// Quarter wave-plate
export const glass = Tensor.product(
  direction.identity,
  polarization.globalPhase(TAU / 4)
);

// Quarter wave-plate phase, but with opposite sign
export const vacuumJar = Tensor.product(
  direction.identity,
  polarization.globalPhase(-TAU / 4)
);


export const absorber = Tensor.product(
  direction.identity,
  polarization.globalAbsorption(0.5)
);

// TODO check sign
export const sugarSolution = Tensor.product(
  direction.identity,
  polarization.rotation(TAU / 8)
);

export const doubleSugarSolution = Tensor.product(
  direction.identity,
  polarization.rotation(TAU / 4)
);

// TODO make the formula easier or at least understand it
const covariantAngle = (elementRotation, lightDirection) =>
  (1 - (lightDirection & 2)) * (1 - 2 * (lightDirection & 1)) * (-elementRotation - 2 * lightDirection) * TAU / 8;

export const polarizer = _.range(4).map((rotation) =>
  Tensor.sumList(
    direction.diode.map((directionGo, i) =>
      Tensor.product(
        directionGo,
        polarization.projection(covariantAngle(rotation, i))
      )
    )
  )
);

export const polarizerNS = _.range(4).map((rotation) =>
  Tensor.sumList(
    direction.diode.map((directionGo, i) => {
      if (i === 1 || i === 3) {
        return Tensor.product(
          directionGo,
          polarization.projection(covariantAngle(rotation, i))
        );
      } else {
        return Tensor.product(
          directionGo,
          polarization.zero
        );
      }
    })
  )
);

export const polarizerWE = _.range(4).map((rotation) =>
  Tensor.sumList(
    direction.diode.map((directionGo, i) => {
      if (i === 0 || i === 2) {
        return Tensor.product(
          directionGo,
          polarization.projection(covariantAngle(rotation, i))
        );
      } else {
        return Tensor.product(
          directionGo,
          polarization.zero
        );
      }
    })
  )
);

// NOTE same notes as for polarizer
export const quarterWavePlate = _.range(4).map((rotation) =>
  Tensor.sumList(
    direction.diode.map((directionGo, i) =>
      Tensor.product(
        directionGo,
        polarization.phaseShift(
          covariantAngle(rotation, i),
          TAU / 4
        )
      )
    )
  )
);

// NOTE if I use 'zero' instead of this tensor product,
// 'zero' changes; I am not sure if it is a priblem with sumList or what
export const quarterWavePlateNS = _.range(4).map((rotation) =>
  Tensor.sumList(
    direction.diode.map((directionGo, i) => {
      if (i === 1 || i === 3) {
        return Tensor.product(
          directionGo,
          polarization.phaseShift(
            covariantAngle(rotation, i),
            TAU / 4
          )
        );
      } else {
        return Tensor.product(
          directionGo,
          polarization.zero
        );
      }
    })
  )
);

export const quarterWavePlateWE = _.range(4).map((rotation) =>
  Tensor.sumList(
    direction.diode.map((directionGo, i) => {
      if (i === 0 || i === 2) {
        return Tensor.product(
          directionGo,
          polarization.phaseShift(
            covariantAngle(rotation, i),
            TAU / 4
          )
        );
      } else {
        return Tensor.product(
          directionGo,
          polarization.zero
        );
      }
    })
  )
);

export const faradayRotator = _.range(4).map((rotation) =>
  Tensor.sum(
    Tensor.product(
      direction.diode[rotation],
      polarization.rotation(TAU / 8)
    ),
    Tensor.product(
      direction.diode[(rotation + 2) % 4],
      polarization.rotation(- TAU / 8)
    )
  )
);
