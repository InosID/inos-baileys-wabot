const axios = require("axios");
const cheerio = require("cheerio");

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(find, 'g'), replace);
}

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

/**
 * @params Nama
 * @returns {String} Arti dari nama
 */
async function artiNama(nama) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const isi = $("#body").text().split("Nama:")[0];
                const result = isi.replace(/\n/gi, "").replace("ARTI NAMA", "").replace("                                ", "");
                resolve(result);
            }).catch(reject);
    });
};

/**
 * @params Kata kunci dari mimpi
 * @returns {String} Hasil pencarian dari kata kunci
 */
async function artiMimpi(mimpi) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://www.primbon.com/tafsir_mimpi.php?mimpi=${mimpi}&submit=+Submit+`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const cek = $("#body > font > i").text();
                const adaga = /Tidak ditemukan/g.test(cek) ? false : true;
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

/**
 * @params Nama anda
 * @params Nama pasangan
 * @returns {Promise<Object>} Nama anda, nama pasangan, sisi positif anda, sisi negatif anda, dan gambar love.
 */
async function ramalJodoh(nama1, nama2) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`)
            .then(({
                data
            }) => {
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

/**
 * @params tanggal jadian/pernikahan. contoh 1-2-2000
 * @returns {String} Hasil pencarian dari tanggal jadian/pernikahan.
 */
async function tanggaljadi(tanggal) {
    return new Promise(async (resolve, reject) => {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        await axios.get(`https://www.primbon.com/tanggal_jadian_pernikahan.php?tgl=${tgl}&bln=${bln}&thn=${thn}&proses=+Submit%21+`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = $("#body").text().replace("Karakteristik:", "\nKarakteristik:").replace("Hubungan", "\nHubungan").replace(/^\s*\n/gm, "").replace(/< Hitung Kembali.*$/s, "")
                resolve(result);
            }).catch(reject);
    });
};

/**
 * @params nama artis indonesia
 * @params Tanggal lahir artis. contoh 1-2-2000
 * @returns {String} Hasil watak artis.
 */
async function watakartis(nama, tanggal) {
    return new Promise(async (resolve, reject) => {
        const tgl = Tanggal(tanggal).tanggal;
        const bln = Tanggal(tanggal).bulan;
        const thn = Tanggal(tanggal).tahun;
        await axios.get(`https://www.primbon.com/selebriti.php?nama=${nama}&tgl=${tgl}&bln=${bln}&thn=${thn}&submit=submit#`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const result = $("#body").text().replace(/^\s*\n/gm, "").replace("Berdasarkan", "\nBerdasarkan").replace("Nama:", "\nNama:").replace("Tgl. Lahir:", "\nTanggal Lahir:").replace("Weton:", "\nWeton:").replace("Mongso:", "\nMongso:").replace("Wuku:", "\nWuku:").replace("Dibawah", "\n\nDibawah").replace(/1\. /g, "\n1. ").replace(/2\. /g, "\n2. ").replace(/3\. /g, "\n3. ").replace(/4\. /g, "\n4. ").replace(/5\. /g, "\n5. ").replace(/6\. /g, "\n6. ").replace(/7\. /g, "\n7. ").replace(/8\. /g, "\n8. ").replace(/9\. /g, "\n9. ").replace(/10\. /g, "\n10. ").replace(/adalah:/g, "adalah:\n").replace("KEADAAN UMUM", "\nKEADAAN UMUM").replace("ALAM SEMESTA", "\nALAM SEMESTA").replace("POSTUR TUBUH", "\nPOSTUR TUBUH").replace("KEADAAN MASA KANAK-KANAK", "\nKEADAAN MASA KANAK-KANAK").replace("KEADAAN MASA REMAJA", "\nKEADAAN MASA REMAJA").replace("CIRI KHAS", "\nCIRI KHAS").replace("IKATAN PERSAHABATAN", "\nIKATAN PERSAHABATAN").replace("KEADAAN KESEHATAN", "\nKEADAAN KESEHATAN").replace("PEKERJAAN YANG COCOK", "\nPEKERJAAN YANG COCOK").replace("GAMBARAN TENTANG REJEKI", "\nGAMBARAN TENTANG REJEKI").replace("SAAT YANG TEPAT", "\nSAAT YANG TEPAT").replace("HOBI", "\nHOBI").replace("JODO PINASTI", "\nJODO PINASTI").replace("BATU PERMATA", "\nBATU PERMATA").replace("WARNA YANG COCOK", "\nWARNA YANG COCOK").replace("BUNGA", "\nBUNGA").replace(/Di bawah ini.*$/s, "")
                resolve(result);
            }).catch(reject);
    });
};

/**
 * @params Nama mu
 * @params Tanggal lahir. contoh 1-1-2000
 * @params Nama pasangan
 * @params Tanggal lahir. contoh 1-1-2000
 * @returns {String} Hasil ramalan jodoh.
 */
async function ramalanjodoh(nama1, tanggal1, nama2, tanggal2) {
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
        await axios(options).then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const result = $('#body').text().replace(/^\s*\n/gm, "").replace(nama1, `\n${nama1}`).replace(/Tgl\. Lahir:/g, "\nTanggal Lahir:").replace(nama2, `\n${nama2}`).replace("Dibawah", "\n\nDibawah").replace(/1\. /g, "\n1. ").replace(/2\. /g, "\n2. ").replace(/3\. /g, "\n3. ").replace(/4\. /g, "\n4. ").replace(/5\. /g, "\n5. ").replace(/6\. /g, "\n6. ").replace(/7\. /g, "\n7. ").replace(/8\. /g, "\n8. ").replace(/9\. /g, "\n9. ").replace(/10\. /g, "\n10. ").replace(/\*/s, "\n\n*").replace(/< Hitung Kembali.*$/s, "")
            resolve(result);
        }).catch(reject);
    });
}

/**
 * @params Tanggal lahir. contoh 1-1-2000
 * @returns {Promise<Object>} Penjelasan, dan gambar statistik.
 */
async function rejekiweton(tanggal) {
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
        await axios(options).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const res = $('#body').text().replace(/^\s*\n/gm, "").replace("Hari Lahir:", "\nHari Lahir:").replace("Seseorang", "\nSeseorang").replace("Fluktuasi", "\n\nFluktuasi").replace("Hover\n", "").replace(/< Hitung Kembali.*$/s, "")
            const stats = 'https://www.primbon.com/' + $('#body > span > img').attr('src')
            result = {
                penjelasan: res,
                statistik: stats
            };
            resolve(result);
        }).catch(reject);
    });
}

/**
 * @params Nama
 * @params Tanggal lahir. contoh 1-1-2000
 * @returns {String} Hasil kecocokan nama dengan tanggal lahir.
 */
async function kecocokannama(nama, tanggal) {
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

        await axios(options).then(({
            data
        }) => {
            const $ = cheerio.load(data);
            const result = $('#body').text().replace(/^\s*\n/gm, "").replace("Tgl. Lahir:", "\nTanggal Lahir:").replace(/< Hitung Kembali.*$/s, "")
            resolve(result)
        }).catch(reject);
    })
}

/**
 * @params Tanggal. contoh 1-1-2000
 * @returns {String} Hasil kecocokan nama dengan tanggal lahir.
 */
async function haribaik(tanggal) {
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
        await axios(options).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const result = $('#body').text().replace(/^\s*\n/gm, "").replace("Watak", "\nWatak").replace("Kamarokam", "Kamarokam\n").replace(thn, `${thn}\n`).replace(/< Hitung Kembali.*$/s, "")
            resolve(result)
        }).catch(reject);
    })
}

/**
 * @params Tanggal. contoh 1-1-2000
 * @returns {String} Hasil kecocokan nama dengan tanggal lahir.
 */
async function harilarangan(tanggal) {
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
        await axios(options).then(({
            data
        }) => {
            const $ = cheerio.load(data)
            const result = $('#body').text().replace(/^\s*\n/gm, "").replace(tgl, `\n${tgl}`).replace("Termasuk", "\nTermasuk").replace(/Untuk mengetahui.*$/s, "")
            resolve(result)
        }).catch(reject);
    })
}
async function zodiakMing(querry) {
    const link = await axios.get(`https://www.fimela.com/zodiak/${querry}/minggu-ini`)
    const $ = cheerio.load(link.data)
    let thumb = $('body > div > div > div').find('div > div > a > img').attr('src')
    let judul = $('body > div > div > div').find('div > div > div.zodiak--content-header__text > h5').text().trim()
    let date = $('body > div > div > div').find('div> div.zodiak--content-header__text > span').text().trim()
    let hoki = $('body > div > div > div > div').find('div > div > div:nth-child(1) > div > span').text().trim()
    let umum = $('body > div > div > div > div').find(' div > div > div:nth-child(1) > div > p').text().trim()
    let love = $('body > div > div > div > div').find(' div > div > div:nth-child(2) > div > p').text().trim()
    let keuangan = $('body > div > div > div > div').find(' div > div > div:nth-child(3) > div > p').text().trim()
    const result = {
        data: {
            zodiak: judul,
            thumb: thumb,
            date: date,
            nomer_hoki: hoki,
            ramalan: {
                umum: umum,
                love: love,
                keuangan: keuangan
            }
        }
    }
    return result
}

async function zodiakHar(querry) {
    let Hasil = []
    await axios(`https://www.fimela.com/zodiak/${querry}`, {
        method: "GET",
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        }
    }).then(({
        data
    }) => {
        const $ = cheerio.load(data)
        let thumb = $('body > div > div > div').find('div > div > a > img').attr('src')
        let judul = $('body > div > div.container-main > div.container-article > div').find('div.zodiak--content-header__right > div.zodiak--content-header__text > h5').text().trim()
        let tanggal = $('body > div > div > div > div > div > div > span').text().trim()
        let nomer_ = $('body > div > div > div > div > div > div').find('div:nth-child(1) > div.zodiak--content__content > span').text().trim()
        let isi = []
        $('body > div > div > div > div > div > div').each(function(a, b) {
            let umum = $(this).find('div:nth-child(1) > div.zodiak--content__content > p').text().trim() || undefined
            let love = $(this).find('div:nth-child(2) > div.zodiak--content__content > p').text().trim() || undefined
            let keuangan = $(this).find('div:nth-child(3) > div.zodiak--content__content > p').text().trim() || undefined
            let Data = {
                umum: umum,
                love: love,
                keuangan: keuangan
            }
            isi.push(Data)
        })
        let ramal = []
        isi.map(ryuzin => {
            if (ryuzin.umum === undefined) return
            if (ryuzin.love === undefined) return
            if (ryuzin.keuangan === undefined) return
            ramal.push(ryuzin)
        })
        const result = {
            judul: judul,
            thumb: thumb,
            date: tanggal,
            no_hoki: nomer_,
            ramalan: ramal[0]
        }
        Hasil.push(result)
    })
    return Hasil[0]
}

module.exports = {
    artiNama,
    artiMimpi,
    ramalJodoh,
    tanggaljadi,
    watakartis,
    ramalanjodoh,
    rejekiweton,
    kecocokannama,
    haribaik,
    harilarangan,
    zodiakMing,
    zodiakHar
};
