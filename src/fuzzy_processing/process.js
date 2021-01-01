const { deviationFuzzySets, distanceLightFuzzySets, distanceObstacleFuzzySets, lightStatusFuzzySets, speedFuzzySets } = require("./fuzzy-sets");
const { readSpeedRules } = require("./rule-readers");

function caculateSpeed(distanceObstacle, lightStatus, distanceLight, deviation) {
  const firedFuzzySetAndFiredValue = getAllFiredFuzzySetAndFiredValue(distanceObstacle, lightStatus, distanceLight, deviation); // {light_status_green: 0.667, distance_light_medium: 0.499}
  const firedFuzzySets = Object.keys(firedFuzzySetAndFiredValue);

  const speedRules = readSpeedRules();
  const subResults = []; // {deFuzzyValue: 0.3, weight: 0.2 }
  speedRules.forEach((rule) => {
    const ruleConditions = getRuleCondition(rule);
    if (checkRuleIsFired(firedFuzzySets, ruleConditions)) {
      const subResultFuzzySet = getSubResultFuzzySet(firedFuzzySetAndFiredValue, rule);
      const deFuzzyValue = deFuzzy(subResultFuzzySet);
      const weight = caculateWeight(firedFuzzySetAndFiredValue, ruleConditions);
      subResults.push({ deFuzzyValue, weight });
    }
  });

  const output = integrateSubResult(subResults);
  return output;
}

function getAllFiredFuzzySetAndFiredValue(distanceObstacle, lightStatus, distanceLight, deviation) {
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

function getRuleCondition(rule) {
  const values = Object.values(rule);
  values.pop();
  return values;
}

function checkRuleIsFired(firedFuzzySets, ruleConditions) {
  return ruleConditions.every((fuzzySetCondition) => firedFuzzySets.includes(fuzzySetCondition));
}

function caculateWeight(firedFuzzySetAndValue, ruleConditions) {
  let weight = 1;
  ruleConditions.forEach((fuzzySetCondition) => {
    weight *= firedFuzzySetAndValue[fuzzySetCondition];
  });
  return weight;
}

function getSubResultFuzzySet(firedFuzzySetAndValue, rule) {
  const conditions = getRuleCondition(rule);
  const firedValues = conditions.map((condition) => firedFuzzySetAndValue[condition]);
  const minFiredValue = Math.min(...firedValues);
  const concludeFuzzySetName = Object.values(rule).pop();
  const concludeFuzzySet = speedFuzzySets.find((fz) => fz.name === concludeFuzzySetName);
  return function (x) {
    return Math.min(minFiredValue, concludeFuzzySet.muy(x));
  };
}

function deFuzzy(muy, step = 1 / 10000) {
  let ts = 0;
  let ms = 0;
  for (let u = 0; u <= 1; u += step) {
    let mu = muy(u);
    ts += mu * u;
    ms += mu;
  }
  return ts / ms;
}

function integrateSubResult(subResults) {
  let ts = 0;
  let ms = 0;
  subResults.forEach((subResult) => {
    ts += subResult.deFuzzyValue * subResult.weight;
    ms += subResult.weight;
  });
  return ts / ms;
}

console.log(caculateSpeed(0.025, 0.8, 0.2, 0.34));
