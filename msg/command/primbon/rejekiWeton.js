/**
 * Rejeki weton scrapper by @Fxc7
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
      url: 'https://primbon.com/rejeki_hoki_weton.php',
      data: new URLSearchParams(Object.entries({
        tgl,
        bln,
        thn,
        submit: " Submit! "
      })),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };
    await axios(options).then(({ data }) => {
      const $ = cheerio.load(data);
      const res = $('#body').text().replace(/^\s*\n/gm, "").replace("Hari Lahir:", "\nHari Lahir:").replace("Seseorang", "\nSeseorang").replace("Fluktuasi", "\n\nFluktuasi").replace("Hover\n", "").replace(/< Hitung Kembali.*$/s, "");
      const stats = 'https://www.primbon.com/' + $('#body > span > img').attr('src');
      result = {
        penjelasan: res,
        statistik: stats
      };
      resolve(result);
    }).catch(reject);
  });
}

module.exports = { result };
