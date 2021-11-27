/**
 * Hari baik scrapper by @Fxc7
 * #Jangan Lupa Titik Koma;
 */
let axios = require('axios');
let cheerio = require('cheerio');
let { Tanggal } = require('./functions');

async function result(tanggal) {
  return new Promise(async (resolve, reject) => {
    const tgl = Tanggal(tanggal).tanggal;
    const bln = Tanggal(tanggal).bulan;
    const thn = Tanggal(tanggal).tahun;
    const options = {
      method: 'POST',
      url: 'https://primbon.com/petung_hari_baik.php',
      data: new URLSearchParams(Object.entries({
        tgl,
        bln,
        thn,
        submit: " Submit! "
      })),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    };
    await axios(options).then(({ data }) => {
      const $ = cheerio.load(data);
      const result = {
        result: $('#body').text().replace(/^\s*\n/gm, "").replace("Watak", "\nWatak").replace("Kamarokam", "Kamarokam\n").replace(thn, `${thn}\n`).replace(/< Hitung Kembali.*$/s, "")
      };
      resolve(result);
    }).catch(reject);
  });
}

module.exports = { result };
