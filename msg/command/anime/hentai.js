/**
 * Random hentai
 */
const HMfull = require('hmfull')

async function getRandomPick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

async function result() {
  return new Promise(async(resolve, reject) => {
    let res = await HMfull.HMtai.nsfw.hentai()
    resolve(res.url);
  })
}

module.exports = { result }
