/* Photofunia by @Fxc7 */
'use strict';

var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
const axios = __importDefault(require("axios")).default;
const cheerio = __importDefault(require("cheerio"));
const fakeUa = __importDefault(require("fake-useragent"));
const qs = __importDefault(require("qs"));

async function result(url, text) {
  return new Promise(async (resolve, reject) => {
    await axios.default({
      method: "POST",
      url,
      data: qs.default.stringify({ "text": text }),
      headers: {
	"User-Agent": fakeUa.default()
      }
    }).then(({ data }) => {
      const $ = cheerio.default.load(data);
      let result = {
        result: $("div.image-container > div.image > img").attr("src")
      }
      resolve(result);
    }).catch(reject);
  });
}

module.exports = { result }
