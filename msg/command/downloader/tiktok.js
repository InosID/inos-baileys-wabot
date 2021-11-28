const axios = require("axios");
const cheerio = require("cheerio");
const formData = require("form-data");

async function musically(url) {
    return new Promise(async (resolve, reject) => {
        await axios.request({
            method: "get",
            url: "https://musicaldown.com/",
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
                "Cookie": "lang=id;_ga=GA1.2.122786463.1635011088;_gid=GA1.2.274868459.1635011089;__gads=ID=e8e3cf9a91cbef43-22136fabd5cc0031:T=1635011088:RT=1635011088:S=ALNI_Mbq91SeytOt5cVB7NdRH1_kRCKSiQ;session_data=acdb3fc90ad75de6786a2d83021d2f52;_gat_gtag_UA_197840056_1=1"
            }
        }).then(async result => {
            if (result.status !== 200) return;
            $ = cheerio.load(result.data);
            const form = new formData();
            let input = [];
            $("form > div > div > input").get().map(a => {
                input.push({
                    name: $(a).attr("name"),
                    value: $(a).attr("value")
                });
            });
            form.append(input[0].name, url);
            form.append(input[1].name, input[1].value);
            form.append(input[2].name, input[2].value);
            await axios.request({
                method: "POST",
                url: "https://musicaldown.com/id/download",
                data: form,
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
                    "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
                    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    "origin": "https://musicaldown.com",
                    "referer": "https://musicaldown.com/id",
                    "Cookie": "lang=id;_ga=GA1.2.122786463.1635011088;_gid=GA1.2.274868459.1635011089;__gads=ID=e8e3cf9a91cbef43-22136fabd5cc0031:T=1635011088:RT=1635011088:S=ALNI_Mbq91SeytOt5cVB7NdRH1_kRCKSiQ;session_data=acdb3fc90ad75de6786a2d83021d2f52;_gat_gtag_UA_197840056_1=1"
                }
            }).then(({
                data
            }) => {
                _ = cheerio.load(data);
                result = {
                    title: _("h2.white-text").text().trim().split(": ")[1],
                    thumb: _("img.responsive-img").attr("src"),
                    url_nowm: _("a.waves-effect").eq(1).attr("href"),
                    url_nowm2: _("a.waves-effect").eq(2).attr("href"),
                    url_wm: _("a.waves-effect").eq(3).attr("href")
                };
                resolve(result);
            }).catch(reject);
        }).catch(reject);
    });
}

module.exports = { musically };
