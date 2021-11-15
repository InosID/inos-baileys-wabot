let fetch = require('node-fetch')
let fs = require('fs')

exports.getBuffer = getBuffer = async (url) => {
  let res = await fetch(
    url, {
      headers: {
        'User-Agent': 'okhttp/4.5.0'
      }, method: 'GET'
    }
  )
  let emr = fs.readFileSync('./emror.jpeg')
  if (!res.ok) return {
    type: 'image/jpeg', result: emr
  }
  let buff = await res.buffer()
  if (buff)
  return {
    type: res.headers.get('content-type'),
    result: buff
  }
}

exports.fetchJson = fetchJson = (url, options) => new Promise(async (resolve, reject) => {
  fetch(
    url,
    options
  )
  .then(response => response.json())
  .then(json => {
    resolve(json)
  })
  .catch((err) => {
    reject(err)
  })
})
