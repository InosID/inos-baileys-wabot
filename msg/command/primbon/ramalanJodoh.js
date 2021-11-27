/**
 * Ramalan jodoh scrapper by @Fxc7
 * #Jangan Lupa Titik Koma;
 */
let axios = require('axios');
let cheerio = require('cheerio');
let { Tanggal } = require('./functions');

async function result(nama1, tanggal1, nama2, tanggal2) {
  return new Promise(async (resolve, reject) => {
    const tgl1 = Tanggal(tanggal1).tanggal;
    const bln1 = Tanggal(tanggal1).bulan;
    const thn1 = Tanggal(tanggal1).tahun;
    const tgl2 = Tanggal(tanggal2).tanggal;
    const bln2 = Tanggal(tanggal2).bulan;
    const thn2 = Tanggal(tanggal2).tahun;
    const options = {
      method: 'POST',
      url: 'https://primbon.com/ramalan_jodoh.php',
      data: new URLSearchParams(Object.entries({
        nama1,
        tgl1,
        bln1,
        thn1,
        nama2,
        tgl2,
        bln2,
        thn2,
        submit: " RAMALAN JODOH &#62;&#62; "
      })),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };
    await axios(options).then(({ data }) => {
      const $ = cheerio.load(data);
      const result = {
        result: $('#body').text().replace(/^\s*\n/gm, "").replace(nama1, `\n${nama1}`).replace(/Tgl\. Lahir:/g, "\nTanggal Lahir:").replace(nama2, `\n${nama2}`).replace("Dibawah", "\n\nDibawah").replace(/1\. /g, "\n1. ").replace(/2\. /g, "\n2. ").replace(/3\. /g, "\n3. ").replace(/4\. /g, "\n4. ").replace(/5\. /g, "\n5. ").replace(/6\. /g, "\n6. ").replace(/7\. /g, "\n7. ").replace(/8\. /g, "\n8. ").replace(/9\. /g, "\n9. ").replace(/10\. /g, "\n10. ").replace(/\*/s, "\n\n*").replace(/< Hitung Kembali.*$/s, "")
      }
      resolve(result);
    }).catch(reject);
  });
}

module.exports = { result };
