/**
 * Arti mimpi by @Fxc7
 */
let axios = require('axios')
let cheerio = require('cheerio')

async function result(mimpi) {
  return new Promise(async (resolve, reject) => {
    await axios.get(`https://www.primbon.com/tafsir_mimpi.php?mimpi=${mimpi}&submit=+Submit+`)
      .then(({ data }) => {
        const $ = cheerio.load(data)
        const cek = $("#body > font > i").text()
        const adaga = /Tidak ditemukan/g.test(cek) ? false : true
        if (adaga) {
          const isi = $("#body").text().split(`Hasil pencarian untuk kata kunci: ${mimpi}`)[1].replace(/\n\n\n\n\n\n\n\n\n/gi, "\n");
          const result = isi.replace(/\n/gi, "").replace("       ", "").replace("\"        ", "").replace(/Solusi.*$/, "");
          const hasil = replaceAll(`${result}`, ".Mimpi", ".\nMimpi");
          resolve(hasil);
        } else {
          resolve(`Tidak ditemukan tafsir mimpi ${mimpi}. Cari dengan kata kunci yang lain..`);
        }
      }).catch(reject);
  });
};

module.exports = { result }
