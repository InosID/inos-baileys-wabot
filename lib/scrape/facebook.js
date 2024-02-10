// const axios = require('axios');
// const cheerio = require('cheerio');
// const got = require('got');

// async function snapsave(url) {
//   return new Promise(async (resolve) => {
//     try {
//       if (
//         !url.match(
//           /(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/
//         ) &&
//         !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)
//       )
//         return resolve({
//           status: false,
//           msg: `Link Url not valid`,
//         });
//       function decodeSnapApp(args) {
//         let [h, u, n, t, e, r] = args;
//         // @ts-ignore
//         function decode(d, e, f) {
//           const g =
//             "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
//               ""
//             );
//           let h = g.slice(0, e);
//           let i = g.slice(0, f);
//           // @ts-ignore
//           let j = d
//             .split("")
//             .reverse()
//             .reduce(function (a, b, c) {
//               if (h.indexOf(b) !== -1)
//                 return (a += h.indexOf(b) * Math.pow(e, c));
//             }, 0);
//           let k = "";
//           while (j > 0) {
//             k = i[j % f] + k;
//             j = (j - (j % f)) / f;
//           }
//           return k || "0";
//         }
//         r = "";
//         for (let i = 0, len = h.length; i < len; i++) {
//           let s = "";
//           // @ts-ignore
//           while (h[i] !== n[e]) {
//             s += h[i];
//             i++;
//           }
//           for (let j = 0; j < n.length; j++)
//             s = s.replace(new RegExp(n[j], "g"), j.toString());
//           // @ts-ignore
//           r += String.fromCharCode(decode(s, e, 10) - t);
//         }
//         return decodeURIComponent(encodeURIComponent(r));
//       }
//       function getEncodedSnapApp(data) {
//         return data
//           .split("decodeURIComponent(escape(r))}(")[1]
//           .split("))")[0]
//           .split(",")
//           .map((v) => v.replace(/"/g, "").trim());
//       }
//       function getDecodedSnapSave(data) {
//         return data
//           .split('getElementById("download-section").innerHTML = "')[1]
//           .split('"; document.getElementById("inputData").remove(); ')[0]
//           .replace(/\\(\\)?/g, "");
//       }
//       function decryptSnapSave(data) {
//         return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
//       }
//       const html = await got
//         .post("https://snapsave.app/action.php?lang=id", {
//           headers: {
//             accept:
//               "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//             "content-type": "application/x-www-form-urlencoded",
//             origin: "https://snapsave.app",
//             referer: "https://snapsave.app/id",
//             "user-agent":
//               "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
//           },
//           form: { url },
//         })
//         .text();
//       const decode = decryptSnapSave(html);
//       const $ = cheerio.load(decode);
//       const results = [];
//       if ($("table.table").length || $("article.media > figure").length) {
//         const thumbnail = $("article.media > figure").find("img").attr("src");
//         $("tbody > tr").each((_, el) => {
//           const $el = $(el);
//           const $td = $el.find("td");
//           const resolution = $td.eq(0).text();
//           let _url =
//             $td.eq(2).find("a").attr("href") ||
//             $td.eq(2).find("button").attr("onclick");
//           const shouldRender = /get_progressApi/gi.test(_url || "");
//           if (shouldRender) {
//             _url = /get_progressApi\('(.*?)'\)/.exec(_url || "")?.[1] || _url;
//           }
//           results.push({
//             resolution,
//             thumbnail,
//             url: _url,
//             shouldRender,
//           });
//         });
//       } else {
//         $("div.download-items__thumb").each((_, tod) => {
//           const thumbnail = $(tod).find("img").attr("src");
//           $("div.download-items__btn").each((_, ol) => {
//             let _url = $(ol).find("a").attr("href");
//             if (!/https?:\/\//.test(_url || ""))
//               _url = `https://snapsave.app${_url}`;
//             results.push({
//               thumbnail,
//               url: _url,
//             });
//           });
//         });
//       }
//       if (!results.length)
//         return resolve({
//           status: false,
//           msg: `Blank data`,
//         });
//       return resolve({ status: true, data: results });
//     } catch (e) {
//       console.log(e)
//       return resolve({
//         status: false,
//         msg: e.message,
//       });
//     }
//   });
// }

// async function getvid(link) {
//   return new Promise((resolve, reject) => { // Create a new promise with resolve and reject handlers
//     const BodyForm = {
//       url: link,
//     };
//     axios({
//       url: "https://www.getfvid.com/downloader", // Send a POST request to a specific URL
//       method: "POST",
//       data: new URLSearchParams(Object.entries(BodyForm)), // Serialize and set form data
//       headers: { // Set request headers
//         accept:
//           "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//         "accept-language": "en-US,en;q=0.9,id;q=0.8",
//         "cache-control": "max-age=0",
//         "content-type": "application/x-www-form-urlencoded",
//         "sec-ch-ua":
//           '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
//         "user-agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
//       },
//     })
//       .then((respon) => {
//         const $ = cheerio.load(respon.data); // Load the response HTML into cheerio
//         let Hd = $(
//           "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered"
//         )
//           .find(
//             "div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(1) > a"
//           )
//           .attr("href"); // Get the HD video URL from the HTML
//         let Normal = $(
//           "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered"
//         )
//           .find(
//             "div > div:nth-child(3) > div > div.col-md-4.btns-download > p:nth-child(2) > a"
//           )
//           .attr("href"); // Get the normal video URL from the HTML
//         let title = $(
//           "body > div.page-content > div > div > div.col-lg-10.col-md-10.col-centered > div > div:nth-child(3) > div > div.col-md-5.no-padd > div > h5 > a"
//         ).text(); // Get the title text from the HTML

//         const result = { // Create a result object
//           status: true,
//           Title: title,
//           Hd: Hd,
//           Sd: Normal,
//         };

//         resolve(result); // Resolve the promise with the result object
//       })
//       .catch((e) => {
//         result = { // Create an error result object
//           status: false,
//           message: e.message,
//         };
//         resolve(result); // Resolve the promise with the error result object
//       });
//   });
// }

// module.exports = { snapsave, getvid };