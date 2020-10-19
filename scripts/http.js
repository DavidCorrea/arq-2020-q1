const http = require('http');

const buildOptions = (endpoint, userToken, method, extraHeaders = {}) => {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: endpoint,
    method: method,
    headers: {
      ...extraHeaders,
      'Content-Type': 'application/json'
    }
  }

  if(userToken) { options.headers['userToken'] = userToken; }

  return options;
};

const get = (endpoint, userToken) => {
  return new Promise((resolve, reject) => {
    const options = buildOptions(endpoint, userToken, 'GET');
    const request = http.request(options, response => {
      response.on('data', res => resolve(JSON.parse(res)));
    });

    request.on('error', error => {
      console.error(`Error: ${error}`);
      reject();
    });

    request.end();
  });
};

const post = (endpoint, data, userToken) => {
  const rawData = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    const options = buildOptions(endpoint, userToken, 'POST', { 'Content-Length': rawData.length });
    const request = http.request(options, response => {
      response.on('data', res => resolve(JSON.parse(res)));
    });

    request.on('error', error => {
      console.error(`Error: ${error}`);
      reject();
    });
  
    request.write(rawData);
    request.end();
  });
};

const patch = (endpoint, data, userToken) => {
  const rawData = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    const options = buildOptions(endpoint, userToken, 'PATCH', { 'Content-Length': rawData.length });
    const request = http.request(options, response => {
      response.on('data', res => resolve(JSON.parse(res)));
    });

    request.on('error', error => {
      console.error(`Error: ${error}`);
      reject();
    });
  
    request.write(rawData);
    request.end();
  });
};

module.exports = { get, post, patch }