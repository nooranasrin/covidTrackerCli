const fuzzy = require('fuzzy');
const states = require('../json/states.json');
const cities = require('../json/cities.json');
const countries = require('../json/countries.json');

const search = function (list, answers, input = '') {
  return new Promise(function (resolve) {
    setTimeout(() => {
      const fuzzyResult = fuzzy.filter(input, list);
      resolve(fuzzyResult.map((state) => state.original));
    }, 200);
  });
};

const prompt = {
  state: {
    type: 'autocomplete',
    name: 'state',
    message: 'Select the state name',
    source: search.bind(null, states),
  },
  district: {
    type: 'autocomplete',
    name: 'city',
    message: 'Select the city name',
    source: search.bind(null, cities),
  },
  country: {
    type: 'autocomplete',
    name: 'country',
    message: 'Select the country name',
    source: search.bind(null, countries),
  },
};

module.exports = prompt;
