/**
 * Watak artis scrapper by @Fxc7
 * #Jangan Lupa Titik Koma;
 */
let axios = require('axios');
let cheerio = require('cheerio');
let { Tanggal } = require('./functions');

async function result(nama, tanggal) {
  return new Promise(async (resolve, reject) => {
    const tgl = Tanggal(tanggal).tanggal;
    const bln = Tanggal(tanggal).bulan;
    const thn = Tanggal(tanggal).tahun;
    await axios.get(`https://www.primbon.com/selebriti.php?nama=${nama}&tgl=${tgl}&bln=${bln}&thn=${thn}&submit=submit#`)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const result = {
          result: $("#body").text().replace(/^\s*\n/gm, "").replace("Berdasarkan", "\nBerdasarkan").replace("Nama:", "\nNama:").replace("Tgl. Lahir:", "\nTanggal Lahir:").replace("Weton:", "\nWeton:").replace("Mongso:", "\nMongso:").replace("Wuku:", "\nWuku:").replace("Dibawah", "\n\nDibawah").replace(/1\. /g, "\n1. ").replace(/2\. /g, "\n2. ").replace(/3\. /g, "\n3. ").replace(/4\. /g, "\n4. ").replace(/5\. /g, "\n5. ").replace(/6\. /g, "\n6. ").replace(/7\. /g, "\n7. ").replace(/8\. /g, "\n8. ").replace(/9\. /g, "\n9. ").replace(/10\. /g, "\n10. ").replace(/adalah:/g, "adalah:\n").replace("KEADAAN UMUM", "\nKEADAAN UMUM").replace("ALAM SEMESTA", "\nALAM SEMESTA").replace("POSTUR TUBUH", "\nPOSTUR TUBUH").replace("KEADAAN MASA KANAK-KANAK", "\nKEADAAN MASA KANAK-KANAK").replace("KEADAAN MASA REMAJA", "\nKEADAAN MASA REMAJA").replace("CIRI KHAS", "\nCIRI KHAS").replace("IKATAN PERSAHABATAN", "\nIKATAN PERSAHABATAN").replace("KEADAAN KESEHATAN", "\nKEADAAN KESEHATAN").replace("PEKERJAAN YANG COCOK", "\nPEKERJAAN YANG COCOK").replace("GAMBARAN TENTANG REJEKI", "\nGAMBARAN TENTANG REJEKI").replace("SAAT YANG TEPAT", "\nSAAT YANG TEPAT").replace("HOBI", "\nHOBI").replace("JODO PINASTI", "\nJODO PINASTI").replace("BATU PERMATA", "\nBATU PERMATA").replace("WARNA YANG COCOK", "\nWARNA YANG COCOK").replace("BUNGA", "\nBUNGA").replace(/Di bawah ini.*$/s, "")
        }
        resolve(result);
      }).catch(reject);
  });
}

module.exports = { result };
