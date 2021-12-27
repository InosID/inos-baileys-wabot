let axios = require("axios").default;

exports.getBuffer = getBuffer = async(url) => new Promise(async(resolve, reject) => {
  await axios({
    method: "get",
    url,
    headers: {
      'DNT': 1,
      'Upgrade-Insecure-Request': 1
    },
    responseType: 'arraybuffer'
  })
  .then(({ data }) => {
    resolve(data);
  }).catch(reject);
})

exports.getJson = getJson = (url) => new Promise(async(resolve, reject) => {
  axios.get(url)
    .then(({ data }) => {
      resolve(data);
    }).catch(reject);
})
