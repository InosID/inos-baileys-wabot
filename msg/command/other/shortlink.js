// shortlink scraper by @hadi-api
let axios = require('axios')
let user = require('fake-useragent').default

async function result(URL) {
  return new Promise(async (resolve, reject) => {
    await axios.post('https://cutt.ly/scripts/shortenUrl.php', 'url='+encodeURIComponent(URL)+'&domain=0', {
      headers: {
        'User-Agent': user
      }
    }).then(res=> {
      dt = res.data;
      resolve(dt)
    }).catch(reject)
  })
}

module.exports = { result }
