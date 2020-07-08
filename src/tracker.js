const https = require('https');
const urls = require('../json/urls.json');

const sendRequest = function (url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (d) => (data += d));
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
};

const getStatus = function (object, state) {
  const status = {};
  status.state = state;
  status.confirmed = object.confirmed;
  status.active = object.active;
  status.recovered = object.recovered;
  status.deaths = object.deaths || 'Data not available';
  return status;
};

const getStateCount = async function (state) {
  const covidCases = await sendRequest(urls.state);
  const stateInfo = covidCases.find((curState) => curState.state === state);
  return getStatus(stateInfo, state);
};

const getDistrictCount = async function (district) {
  const districtData = await sendRequest(urls.district);
  const state = Object.keys(districtData).find((state) => {
    return Object.keys(districtData[state].districtData).includes(district);
  });
  const cityInfo = districtData[state].districtData[district];
  return Object.assign({ district }, getStatus(cityInfo, state));
};

const getWorldCount = async function () {
  const status = await sendRequest(urls.world);
  const worldStatus = {};
  worldStatus.confirmed = +status.data.total_cases.replace(/,/g, '');
  worldStatus.recovered = +status.data.recovery_cases.replace(/,/g, '');
  worldStatus.active = +status.data.currently_infected.replace(/,/g, '');
  worldStatus.death = +status.data.death_cases.replace(/,/g, '');
  return worldStatus;
};

const getCountryCount = async function (country) {
  const status = await sendRequest(`${urls.countries}${country}`);
  const countryStatus = { Confirmed: status.Summary.Confirmed };
  countryStatus.Recovered = status.Summary.Recovered;
  countryStatus.Active = status.Summary.Active;
  countryStatus.Deaths = status.Summary.Deaths;
  return countryStatus;
};

module.exports = {
  getStateCount,
  getDistrictCount,
  getWorldCount,
  getCountryCount,
};
