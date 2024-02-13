const fetch = require("node-fetch");
const FormData = require("form-data");
const { JSDOM } = require("jsdom");

/**
 * Convert WebP to MP4.
 * @param {string} source - URL or file path of the WebP image.
 * @returns {Promise<string>} - URL of the converted MP4 file.
 */
async function webp2mp4(source) {
  // Create a new FormData object
  let form = new FormData();
  // Check if the source is a URL
  let isUrl = typeof source === "string" && /https?:\/\//.test(source);
  // Append necessary data to the form
  form.append("new-image-url", isUrl ? source : "");
  form.append("new-image", isUrl ? "" : source, "image.webp");

  // Make a POST request to the first conversion endpoint
  let res = await fetch("https://ezgif.com/webp-to-mp4", {
    method: "POST",
    body: form,
  });
  
  // Parse the HTML response
  let html = await res.text();
  let { document } = new JSDOM(html).window;

  // Create a new FormData object for the second request
  let form2 = new FormData();
  let obj = {};

  // Extract and append data from the HTML form to the second FormData object
  for (let input of document.querySelectorAll("form input[name]")) {
    obj[input.name] = input.value;
    form2.append(input.name, input.value);
  }

  // Make a POST request to the second conversion endpoint
  let res2 = await fetch("https://ezgif.com/webp-to-mp4/" + obj.file, {
    method: "POST",
    body: form2,
  });

  // Parse the HTML response of the second request
  let html2 = await res2.text();
  let { document: document2 } = new JSDOM(html2).window;

  // Return the URL of the converted MP4 file
  return new URL(
    document2.querySelector("div#output > p.outfile > video > source").src,
    res2.url
  ).toString();
}

/**
 * Convert WebP to PNG.
 * @param {string} source - URL or file path of the WebP image.
 * @returns {Promise<string>} - URL of the converted PNG file.
 */
async function webp2png(source) {
  // Create a new FormData object
  let form = new FormData();
  // Check if the source is a URL
  let isUrl = typeof source === "string" && /https?:\/\//.test(source);
  // Append necessary data to the form
  form.append("new-image-url", isUrl ? source : "");
  form.append("new-image", isUrl ? "" : source, "image.webp");

  // Make a POST request to the first conversion endpoint
  let res = await fetch("https://ezgif.com/webp-to-png", {
    method: "POST",
    body: form,
  });

  // Parse the HTML response
  let html = await res.text();
  let { document } = new JSDOM(html).window;

  // Create a new FormData object for the second request
  let form2 = new FormData();
  let obj = {};

  // Extract and append data from the HTML form to the second FormData object
  for (let input of document.querySelectorAll("form input[name]")) {
    obj[input.name] = input.value;
    form2.append(input.name, input.value);
  }

  // Make a POST request to the second conversion endpoint
  let res2 = await fetch("https://ezgif.com/webp-to-png/" + obj.file, {
    method: "POST",
    body: form2,
  });

  // Parse the HTML response of the second request
  let html2 = await res2.text();
  let { document: document2 } = new JSDOM(html2).window;

  // Return the URL of the converted PNG file
  return new URL(
    document2.querySelector("div#output > p.outfile > img").src,
    res2.url
  ).toString();
}

// Test the functions if this module is run directly
if (require.main === module) {
  webp2mp4("https://mathiasbynens.be/demo/animated-webp-supported.webp").then(
    console.error
  );
  webp2png("https://mathiasbynens.be/demo/animated-webp-supported.webp").then(
    console.error
  );
} else {
  // Export functions if used as a module
  module.exports = { webp2mp4, webp2png };
}
