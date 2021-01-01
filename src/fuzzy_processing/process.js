const { deviationFuzzySets, distanceLightFuzzySets, distanceObstacleFuzzySets, lightStatusFuzzySets } = require("./fuzzy-sets");

function caculateSpeed(distanceObstacle, lightStatus, distanceLight, deviation) {
  const allFiredFzs = getAllFiredFzs(distanceObstacle, lightStatus, distanceLight, deviation);
}

function getAllFiredFzs(distanceObstacle, lightStatus, distanceLight, deviation) {
  const firedDistanceObstacleFzs = findFiredFzs(distanceObstacleFuzzySets, distanceObstacle);
  const firedLightStatusFzs = findFiredFzs(lightStatusFuzzySets, lightStatus);
  const firedDistanceLightFzs = findFiredFzs(distanceLightFuzzySets, distanceLight);
  const firedDeviationFzs = findFiredFzs(deviationFuzzySets, deviation);
  const allFiredFzs = Object.assign({}, firedDistanceObstacleFzs, firedLightStatusFzs, firedDistanceLightFzs, firedDeviationFzs);
  return allFiredFzs;
}

function findFiredFzs(fuzzySets, x) {
  const result = {};
  fuzzySets.forEach((fz) => {
    const firedValue = fz.muy(x);
    if (firedValue > 0) {
      result[fz.name] = firedValue;
    }
  });
  return result;
}

console.log(getAllFiredFzs(0.2, 0.3, 0.4, 0.5));
