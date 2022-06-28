/**
 * Random hentai
 */
const HMfull = require('hmfull')

async function result() {
  return new Promise(async(resolve, reject) => {
    let res = await HMfull.Nekos.nsfw.hentai()
    resolve(res.url);
  })
}

module.exports = { result }
