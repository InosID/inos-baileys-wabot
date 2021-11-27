/**
 * Zodiak minggu ini
 */
let axios = require('axios');
let cheerio = require('cheerio');

async function result(querry) {
  const link = await axios.get(`https://www.fimela.com/zodiak/${querry}/minggu-ini`)
  const $ = cheerio.load(link.data);
  let thumb = $('body > div > div > div').find('div > div > a > img').attr('src')
  let judul = $('body > div > div > div').find('div > div > div.zodiak--content-header__text > h5').text().trim()
  let date = $('body > div > div > div').find('div> div.zodiak--content-header__text > span').text().trim()
  let hoki = $('body > div > div > div > div').find('div > div > div:nth-child(1) > div > span').text().trim()
  let umum = $('body > div > div > div > div').find(' div > div > div:nth-child(1) > div > p').text().trim()
  let love = $('body > div > div > div > div').find(' div > div > div:nth-child(2) > div > p').text().trim()
  let keuangan = $('body > div > div > div > div').find(' div > div > div:nth-child(3) > div > p').text().trim()
  const result = {
    data: {
      zodiak: judul,
      thumb: thumb,
      date: date,
      nomer_hoki: hoki,
      ramalan: {
        umum: umum,
        love: love,
        keuangan: keuangan
      }
    }
  };
  return result;
}

module.exports = { result };
