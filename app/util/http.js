const axios = require('axios');

class Http {
  constructor(options) {
    let defaultOptions = {
      baseURL: '',
      timeout: 30 * 1000,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    };
    this.axios = axios.create(Object.assign({}, defaultOptions, options));

    this.axios.interceptors.request.use(
      function(config) {
        // console.log(config);
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );

    this.axios.interceptors.response.use(
      function(response) {
        return response.data;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
  }
  request(config) {
    return this.axios(config);
  }
}
module.exports = Http;
