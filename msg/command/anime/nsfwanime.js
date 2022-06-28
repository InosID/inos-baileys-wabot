/**
 * Nsfw anime
 */
let HMfull = require('hmfull')

async function result() {
  return new Promise(async (resolve, reject) => {
    let res = await HMfull.HMtai.nsfw.nsfwNeko()
    resolve(res.url)
  })
}

module.exports = { result }
