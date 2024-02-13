const axios = require('axios');

// Async function to download TikTok content using tiktod service
async function tiktod(url) {
  return new Promise(async (resolve, reject) => {
    // Check if the URL is provided
    if (!url) return reject(new Error('Url input is required'));

    // Make a GET request to the tiktod service
    const result = await axios.get('https://tiktod.eu.org/download', { params: { url } });

    // Resolve the promise with the result data
    resolve(result.data);
  });
}

// Export the tiktod function for external use
module.exports = tiktod;