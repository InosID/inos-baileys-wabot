const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk mendapatkan lirik berdasarkan judul lagu
function lyrics(title) {
  return new Promise(async (resolve, reject) => {
    try {
      // Lakukan pencarian menggunakan musixmatch
      const searchUrl = 'https://www.musixmatch.com/search/' + encodeURIComponent(title);
      const { data: searchData } = await axios.get(searchUrl);

      const $ = cheerio.load(searchData);
      const result = {};

      // Ambil URL dari hasil pencarian pertama
      const link = 'https://www.musixmatch.com' + $('div.media-card-body > div > h2').find('a').attr('href');

      // Lakukan pengambilan lirik dari halaman lagu
      const { data: lyricsData } = await axios.get(link);
      const $$ = cheerio.load(lyricsData);

      // Ambil thumbnail dari halaman lagu
      result.thumb = 'https:' + $$('div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div').find('img').attr('src');

      // Ambil teks lirik dari halaman lagu
      $$('div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics').each(function (a, b) {
        result.lyrics = $$(b).find('span > p > span').text() + '\n' + $$(b).find('span > div > p > span').text();
      });

      // Resolve dengan objek hasil lirik
      resolve(result);
    } catch (error) {
      // Reject dengan pesan kesalahan jika terjadi error
      reject(error);
    }
  });
}

// Ekspor fungsi lyrics
module.exports = lyrics;
