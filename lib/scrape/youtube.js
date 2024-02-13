const axios = require('axios');

/**
 * Downloads audio from YouTube and provides details.
 * @param {string} url - YouTube video URL.
 * @returns {Promise<Object>} - Promise resolving to an object with audio details.
 */
async function ytmp3(url) {
  return new Promise(async function(resolve, reject) {
    // Initial request to get video details
    await axios.request({
      method: "POST",
      url: "https://yt1s.com/api/ajaxSearch/index",
      data: `q=${encodeURIComponent(url)}&vt=home`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
        Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atuvc=1%7C51; __atuvs=61c0b56a497017fe000; __atssc=google%3B1; prefetchAd_4425332=true",
      },
    })
    .then(async function({ data }) {
      // Second request to convert and get audio details
      await axios.request({
        method: "POST",
        url: "https://yt1s.com/api/ajaxConvert/convert",
        data: `vid=${encodeURIComponent(data.vid)}&k=${encodeURIComponent(data.links.mp3["mp3128"].k)}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
          Accept: "*/*",
          Origin: "https://yt1s.com/",
          Referer: "https://yt1s.com/id89",
          Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atssc=google%3B1; __atuvc=2%7C51; __atuvs=61c0b56a497017fe001; prefetchAd_3897490=true",
        },
      })
      .then(function({ data: result }) {
        // Resolve with audio details
        resolve({
          title: data.title,
          channel: data.a,
          videoID: data.vid,
          size: data.links.mp3["mp3128"].size,
          quality: data.links.mp3["mp3128"].q,
          url: result.dlink,
        });
      })
      .catch(reject);
    })
    .catch(reject);
  });
}

/**
 * Downloads video from YouTube and provides details.
 * @param {string} url - YouTube video URL.
 * @returns {Promise<Object>} - Promise resolving to an object with video details.
 */
async function ytmp4(url) {
  return new Promise(async (resolve, reject) => {
    // Initial request to get video details
    await axios.request({
      method: "POST",
      url: "https://yt1s.com/api/ajaxSearch/index",
      data: `q=${encodeURIComponent(url)}&vt=home`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
        Accept: "*/*",
        Origin: "https://yt1s.com/",
        Referer: "https://yt1s.com/id89",
        Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atssc=google%3B1; __atuvc=2%7C51; __atuvs=61c0b56a497017fe001; prefetchAd_3897490=true",
      },
    })
    .then(async ({ data }) => {
      // Second request to convert and get video details
      await axios.request({
        method: "post",
        url: "https://yt1s.com/api/ajaxConvert/convert",
        data: `vid=${encodeURIComponent(data.vid)}&k=${encodeURIComponent(data.links.mp4["18"].k)}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent": "Mozilla/5.0 (Linux; Android 9; CPH1923) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.62 Mobile Safari/537.36",
          Accept: "*/*",
          Origin: "https://yt1s.com/",
          Referer: "https://yt1s.com/id89",
          Cookie: "_ga=GA1.2.56066711.1640019302; _gid=GA1.2.1024042191.1640019302; __atssc=google%3B1; __atuvc=2%7C51; __atuvs=61c0b56a497017fe001; prefetchAd_3897490=true",
        },
      })
      .then(({ data: result }) => {
        // Resolve with video details
        resolve({
          title: data.title,
          channel: data.a,
          videoid: data.vid,
          size: data.links.mp4["17"]?.size === undefined ? "" : data.links.mp4["17"].size,
          quality: data.links.mp4["18"].q,
          url: result.dlink,
        });
      })
      .catch(reject);
    })
    .catch(reject);
  });
}

// Exporting functions for external use
module.exports = { ytmp3, ytmp4 };
