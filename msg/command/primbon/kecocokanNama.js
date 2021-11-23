/**
 * Kecocokan nama scrapper by @Fxc7
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

async function result(nama, tanggal) {
  return new Promise(async (resolve, reject) => {
    const tgl = Tanggal(tanggal).tanggal;
    const bln = Tanggal(tanggal).bulan;
    const thn = Tanggal(tanggal).tahun;
    const options = {
      method: 'POST',
      url: 'https://primbon.com/kecocokan_nama.php',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams(Object.entries({
        nama,
        tgl,
        bln,
        thn,
        kirim: " Submit! "
      })),
    };
    await axios(options).then(({ data }) => {
      const $ = cheerio.load(data);
      const result = $('#body').text().replace(/^\s*\n/gm, "").replace("Tgl. Lahir:", "\nTanggal Lahir:").replace(/< Hitung Kembali.*$/s, "")
      resolve(result)
    }).catch(reject);
  })
}

module.exports = { result }