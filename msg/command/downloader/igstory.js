const axios = require('axios')

async function getstory (url) {
return new Promise (async (resolve, reject) => {
await axios.request({
		url: "https://igs.sf-converter.com/api/profile/"+url,
		method: "GET",
		headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "origin": "https://id.savefrom.net",
        "pragma": "no-cache",
        "referer": "https://id.savefrom.net/,",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        }  
		}).then(async respon => {
            let position = []
            let data2 = []
            let id = respon.data.result.id
            await axios.get("https://igs.sf-converter.com/api/stories/"+id).then((res) => {
                Object.values(res.data.result).forEach((i) => {
                  position.push(i)
                })
               for (let i of position) {
                  if (i.video_versions !== undefined) {
                    for (let j of i.video_versions) {
                      if (j.height === 1280) {
                      data2.push(j.url)
                      }
                    }
                  }
                }
            let obj = {
                status: true,
                author: 'piyo',
                data: data2
            }
                resolve(obj)
            }).catch(reject)
    }).catch(reject)
  })
}

module.exports = {
  getstoryvideo: getstory  
}
