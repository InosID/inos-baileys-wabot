/**
 * Ramal Jodoh scrapper by @Fxc7
 * #Jangan Lupa Titik Koma;
 */
let axios = require('axios');
let cheerio = require('cheerio');

async function result(nama1, nama2) {
  return new Promise(async (resolve, reject) => {
    await axios.get(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const res = $('#body').text().split(nama2)[1].replace('< Hitung Kembali', '').split('\n')[0];
        const result = {
          namaAnda: nama1,
          namaPasangan: nama2,
          positif: res.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ', ''),
          negatif: res.split('Sisi Negatif Anda: ')[1],
          thumbnail: 'https://www.primbon.com/' + $('#body > img').attr('src')
        };
        resolve(result);
      }).catch(reject);
  });
}

module.exports = { result };
