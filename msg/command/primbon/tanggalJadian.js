/**
 * Tanggal jadian scrapper by @Fxc7
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
    await axios.get(`https://www.primbon.com/tanggal_jadian_pernikahan.php?tgl=${tgl}&bln=${bln}&thn=${thn}&proses=+Submit%21+`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const result = $("#body").text().replace("Karakteristik:", "\nKarakteristik:").replace("Hubungan", "\nHubungan").replace(/^\s*\n/gm, "").replace(/< Hitung Kembali.*$/s, "")
        resolve(result);
      }).catch(reject);
  });
};

module.exports = { result }
