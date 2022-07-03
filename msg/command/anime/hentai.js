/**
 * Random hentai
 */
const HMfull = require('hmfull')

async function getRandomPick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

async function result() {
  return new Promise(async(resolve, reject) => {
    // let res;
    // let arr = ['a', 'b']
    // if (random == 'a') {
    //   res = await HMfull.Nekos.nsfw.hentai()
    // } else {
    //   res = await HMfull.HMtai.nsfw.hentai()
    // }
    let res = HMfull.HMtai.nsfw.hentai()
    resolve(res.url);
  })
}

module.exports = { result }
