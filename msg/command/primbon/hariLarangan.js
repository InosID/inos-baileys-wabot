/**
 * Hari larangan by @Fxc7
 */
let axios = require('axios')
let cheerio = require('cheerio')

function Tanggal(tanggal) {
  const tgl = tanggal.replace(/-.*/, "");
  const bln = tanggal.replace(/-([^-?]+)(?=(?:$|\?))/, "").replace(/.*?-/, "");
  const thn = tanggal.replace(/.*\-/, "");
  const result = {
    tanggal: tgl,
    bulan: bln,
    tahun: thn
  };
  return result;
}

async function result(tanggal) {
  return new Promise(async (resolve, reject) => {
    const tgl = Tanggal(tanggal).tanggal;
    const bln = Tanggal(tanggal).bulan;
    const thn = Tanggal(tanggal).tahun;
    const options = {
      method: 'POST',
      url: 'https://primbon.com/hari_sangar_taliwangke.php',
      data: new URLSearchParams(Object.entries({
        tgl,
        bln,
        thn,
        kirim: " Submit! "
      })),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };
    await axios(options).then(({ data }) => {
      const $ = cheerio.load(data)
      const result = $('#body').text().replace(/^\s*\n/gm, "").replace(tgl, `\n${tgl}`).replace("Termasuk", "\nTermasuk").replace(/Untuk mengetahui.*$/s, "")
      resolve(result)
    }).catch(reject);
  })
}

module.exports = { result }
