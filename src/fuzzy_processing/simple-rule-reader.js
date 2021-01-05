const speedRules = require("./speedRules.json");
const steeringRules = require("./steeringRules.json");

function readSpeedRules() {
  return speedRules;
}

function readSteeringRules() {
  return steeringRules;
}

module.exports = { readSpeedRules, readSteeringRules };
