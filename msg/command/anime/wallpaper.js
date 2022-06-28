const HMfull = require('hmfull')

async function result() {
  return new Promise(async (resolve, reject) => {
    let res = await HMfull.HMtai.sfw.wallpaper()
    resolve(res.url)
  })
}

module.exports = { result }
