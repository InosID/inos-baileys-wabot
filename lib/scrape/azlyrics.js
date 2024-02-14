const cheerio = require("cheerio");
const request = require("request");
const qs = require("querystring");

// Function to make a proxified request
const proxify = (data, jar) => {
  return new Promise((resolve, reject) => {
    request({
      url: "https://www.4everproxy.com/query",
      method: "POST",
      followAllRedirects: true,
      headers: {
        cookie: jar,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: qs.stringify(data),
    }, (error, response, body) => (!error && response.statusCode == 200 ? resolve(body) : reject(error)));
  });
};

// Function to get configuration details (servers and IPs)
const getConfig = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await new Promise((resolve, reject) => {
        request({
          url: "https://www.4everproxy.com/",
          method: "GET",
        }, (error, response, body) =>
          !error && response.statusCode == 200
            ? resolve({ cookie: response.headers["set-cookie"][0].split(";")[0], body: body })
            : reject(error)
        );
      });

      let $ = cheerio.load(data.body);
      let serverList = [];
      let ipLocList = [];

      $("select[id=server_name] optgroup option").each((i, e) => {
        let obj = {
          location: $(e).text(),
          server_name: $(e).attr("value"),
        };
        serverList.push(obj);
      });

      $("select[name=selip] option").each((i, e) => {
        let obj = {
          ip: $(e).attr("value"),
          location: $(e).text(),
        };
        ipLocList.push(obj);
      });

      resolve({
        cookie: data.cookie,
        proxy_list: {
          servers: serverList,
          ips: ipLocList,
        },
      });
    } catch (error) {
      reject(new Error(`Error while making the request!\n\n${String(error)}`));
    }
  });
};

// Function to find an object in an array based on a location
const getObjectByLocation = (el, array) => {
  return array.find((obj) =>
    obj.location.toLowerCase().includes(el.toLowerCase())
  );
};

// Function to search for a song
const searchSong = async (q) => {
  let { proxy_list, cookie } = await getConfig();
  let formData = {
    u: `https:/\/search.azlyrics.com/suggest.php?q=${q}`,
    u_default: "https://www.google.com/",
    customip: "",
    server_name: getObjectByLocation("newyork", proxy_list.servers).server_name,
    selip: getObjectByLocation("newyork", proxy_list.ips).ip,
    allowCookies: "on",
  };
  let data = await proxify(formData, cookie);
  return JSON.parse(data);
};

// Function to get lyrics
const getLyrics = async (url) => {
  let { proxy_list, cookie } = await getConfig();
  let formData = {
    u: url,
    u_default: "https://www.google.com/",
    customip: "",
    server_name: getObjectByLocation("newyork", proxy_list.servers).server_name,
    selip: getObjectByLocation("newyork", proxy_list.ips).ip,
    allowCookies: "on",
  };
  let html = await proxify(formData, cookie);
  let $ = cheerio.load(html);
  let title = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().text();
  let lyrics = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().next().next().next().text();
  lyrics = lyrics.trimStart().trim().replace(/\[(.*?):\]/g, ``).replace(/\s{2}/g, "\n\n");

  return { title: title, lyricsList: lyrics.trim() };
};

module.exports = {
  searchSong,
  getLyrics,
};
