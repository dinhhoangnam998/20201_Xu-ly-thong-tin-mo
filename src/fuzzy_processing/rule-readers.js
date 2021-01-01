const XLSX = require("xlsx");

function readSpeedRules() {
  const workbook = XLSX.readFile("speed_rules.xlsx");
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rules = XLSX.utils.sheet_to_json(worksheet);
  const newRules = rules.map((rule) => {
    const keys = Object.keys(rule);
    const newRule = {};
    keys.forEach((key) => {
      newRule[key] = key + "_" + rule[key];
    });
    return newRule;
  });
  // console.log(newRules);
  return newRules;
}
module.exports = { readSpeedRules };
