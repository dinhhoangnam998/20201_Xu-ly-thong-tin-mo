const XLSX = require("xlsx");
const fs = require("fs");

let steeringRules;
let speedRules;

function readSpeedRules() {
  if (speedRules) {
    return speedRules;
  } else {
    const workbook = XLSX.readFile("speed_rules.csv");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rules = XLSX.utils.sheet_to_json(worksheet);
    speedRules = rules.map((rule) => {
      const keys = Object.keys(rule);
      // newRule is(prefix + old) to make fuzzy set name global unique
      const newRule = {};
      keys.forEach((key) => {
        newRule[key] = key + "_" + rule[key];
      });
      return newRule;
    });
    // console.log(speedRules);
    fs.writeFileSync("speedRules.json", JSON.stringify(speedRules));
    return speedRules;
  }
}
// readSpeedRules();

function readSteeringRules() {
  if (steeringRules) {
    return steeringRules;
  } else {
    const workbook = XLSX.readFile("steering_rules.csv");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rules = XLSX.utils.sheet_to_json(worksheet);
    steeringRules = rules.map((rule) => {
      const keys = Object.keys(rule);
      // newRule is(prefix + old) to make fuzzy set name global unique
      const newRule = {};
      keys.forEach((key) => {
        newRule[key] = key + "_" + rule[key];
      });
      return newRule;
    });
    // console.log(steeringRules);
    fs.writeFileSync("steeringRules.json", JSON.stringify(steeringRules));
    return steeringRules;
  }
}

// readSteeringRules();
module.exports = { readSpeedRules, readSteeringRules };
