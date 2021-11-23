/**
 * Zodiak hari ini (keknya) by @Fxc7
 */
let axios = require('axios')
let cheerio = require('cheerio')

async function result(querry) {
  let Hasil = []
  await axios(`https://www.fimela.com/zodiak/${querry}`, {
    method: "GET",
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9,id;q=0.8",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    }
  }).then(({
    data
  }) => {
    const $ = cheerio.load(data)
    let thumb = $('body > div > div > div').find('div > div > a > img').attr('src')
    let judul = $('body > div > div.container-main > div.container-article > div').find('div.zodiak--content-header__right > div.zodiak--content-header__text > h5').text().trim()
    let tanggal = $('body > div > div > div > div > div > div > span').text().trim()
    let nomer_ = $('body > div > div > div > div > div > div').find('div:nth-child(1) > div.zodiak--content__content > span').text().trim()
    let isi = []
    $('body > div > div > div > div > div > div').each(function(a, b) {
      let umum = $(this).find('div:nth-child(1) > div.zodiak--content__content > p').text().trim() || undefined
      let love = $(this).find('div:nth-child(2) > div.zodiak--content__content > p').text().trim() || undefined
      let keuangan = $(this).find('div:nth-child(3) > div.zodiak--content__content > p').text().trim() || undefined
      let Data = {
        umum: umum,
        love: love,
        keuangan: keuangan
      }
      isi.push(Data)
    })
    let ramal = []
    isi.map(ryuzin => {
      if (ryuzin.umum === undefined) return
      if (ryuzin.love === undefined) return
      if (ryuzin.keuangan === undefined) return
      ramal.push(ryuzin)
    })
    const result = {
      judul: judul,
      thumb: thumb,
      date: tanggal,
      no_hoki: nomer_,
      ramalan: ramal[0]
    }
    Hasil.push(result)
  })
  return Hasil[0]
}

module.exports = { result }
