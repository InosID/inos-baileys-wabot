/**
 * InfoGempa Scrapper By @Fxc7
 */
let axios = require('axios')
let cheerio = require('cheerio')

async function result() {
  return new Promise(async(resolve, reject) => {
    await axios.get("https://www.bmkg.go.id/")
      .then(({ data }) => {
        $ = cheerio.load(data);
        result = {
          title: $("div.gempabumi-home-bg > div > div > a").attr("title"),
          waktu: $("div.gempabumi-home-bg > div > div.gempabumi-detail > ul > li:nth-child(1)").text(),
          magnitude: $("div.gempabumi-home-bg > div > div.gempabumi-detail > ul > li:nth-child(2)").text(),
          koordinat: $("div.gempabumi-home-bg > div > div.gempabumi-detail > ul > li:nth-child(3)").text(),
          lokasi: $("div.gempabumi-home-bg > div > div.gempabumi-detail > ul > li:nth-child(4)").text(),
          dirasakan: $("div.gempabumi-home-bg > div > div.gempabumi-detail > ul > li:nth-child(5)").text(),
          thumbnail: $("div.gempabumi-home-bg > div > div > a").attr("href")
        };
        resolve(result);
    }).catch(reject);
  });
}

module.exports = { result }
