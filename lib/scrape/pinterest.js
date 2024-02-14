const axios = require('axios');
const fetch = require('node-fetch')

async function pinterestURL(url = '') {
  try {
    // Send a POST request to the URL to fetch video data
    const res = await axios.post("https://www.expertsphp.com/facebook-video-downloader.php", {
      url: url // Use the provided video URL as data
    }, {
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36"
      }
    });

    // Split the response data to extract the video URL
    const result = res.data.split('src="https://v1.pinimg')[1].split('"')[0];

    // Concatenate the video URL with the source URL
    const videoUrl = "https://v1.pinimg" + result;

    // Return the generated video URL
    return videoUrl;
  } catch (error) {
    // Handle errors if any
    console.error('Error:', error.message);
    throw new Error('Failed to fetch video URL');
  }
}

async function pinterestSearch(query = '') {
  // Fetch data from the Pinterest API based on the provided query
  let res = await fetch(
    `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`
  );

  // Parse the response as JSON
  let json = await res.json();

  // Extract the relevant data from the JSON response
  let data = json.resource_response.data.results;

  // Check if the search results are empty
  if (!data.length) throw 'not found';

  // Randomly select a result from the search data (excluding last 10 results)
  let resu = data[~~(Math.random() * (data.length - 10))];

  // If the selected result or its image data is missing, return undefined
  if (resu === undefined || resu.images === undefined || resu.images.orig === undefined) return undefined;

  // Return an object containing the URL, description, and caption of the selected result
  return {
    url: resu.images.orig.url,
    desc: resu.description,
    caption: resu.grid_title,
  };
}

module.exports = { pinterestURL, pinterestSearch }