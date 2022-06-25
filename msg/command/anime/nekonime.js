/**
 * Nekonime Scrapper By @moo-d
 */
const axios = require("axios");

async function result() {
  return new Promise(async(resolve, reject) => {
    await axios.get("https://nekos.life/api/neko")
      .then(({ data }) => {
        const result = {
          image: data.neko
        }
        resolve(result)
      }).catch(reject)
  })
}

module.exports = { result }
