const Vorpal = require('vorpal');
const inquirer = require('inquirer');
const Table = require('cli-table');
const autoComplete = require('inquirer-autocomplete-prompt');
inquirer.registerPrompt('autocomplete', autoComplete);

const prompt = require('../src/prompt');

const {
  getStateCount,
  getDistrictCount,
  getWorldCount,
  getCountryCount,
} = require('../src/tracker');

const printTable = function (obj) {
  const table = new Table();
  Object.entries(obj).forEach((data) => table.push(data));
  console.log(table.toString());
};

const addStateCountCmd = (vorpal) => {
  vorpal.command('state count').action(async function (args, callback) {
    const answers = await inquirer.prompt(prompt.state);
    printTable(await getStateCount(answers.state));
    callback();
  });
};

const addDistrictCountCmd = (vorpal) => {
  vorpal.command('district count').action(async function (args, callback) {
    const answers = await inquirer.prompt(prompt.district);
    printTable(await getDistrictCount(answers.city));
    callback();
  });
};

const addWorldStatusCmd = (vorpal) => {
  vorpal.command('world status').action(async function (args, callback) {
    printTable(await getWorldCount());
    callback();
  });
};

const addCountryStatusCmd = (vorpal) => {
  vorpal.command('country status').action(async function (args, callback) {
    const answers = await inquirer.prompt(prompt.country);
    printTable(await getCountryCount(answers.country));
    callback();
  });
};

const addClearCmd = (vorpal) => {
  vorpal.command('clear').action(function (args, callback) {
    console.clear();
    callback();
  });
};

const setDelimiter = (vorpal) =>
  vorpal.delimiter(vorpal.chalk.gray('covidTracker -> ')).show();

const startCli = function () {
  const covidVorpal = new Vorpal();
  setDelimiter(covidVorpal);
  addClearCmd(covidVorpal);
  addCountryStatusCmd(covidVorpal);
  addWorldStatusCmd(covidVorpal);
  addDistrictCountCmd(covidVorpal);
  addStateCountCmd(covidVorpal);
};

module.exports = startCli;
