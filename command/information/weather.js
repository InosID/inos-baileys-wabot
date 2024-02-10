const fetch = require('node-fetch');

module.exports = {
  name: "cuaca", // Command name
  alias: ["weather"], // Aliases for the command
  use: "<city>", // Command usage format
  category: "information", // Command category
  isQuery: true, // Indicates if it's a query command

  async run({ msg }, { query }) {
    // Construct the URL for fetching weather data
    let fetchURL = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&lang=id`);
    
    // Fetch weather data from the API
    let data = await fetchURL.json();

    // Construct the reply message with weather information
    let caption = `Perkiraan cuaca ${data.name} saat ini ${data.weather[0]?.description}. Suhu mencapai ${data.main.temp}°C terasa seperti ${data.main.feels_like}°C dengan angin berkecepatan ${data.wind.speed} km/h dan kelembapan udara mencapai ${data.main.humidity}%.\n\nhttps://www.google.com/maps/place/${data.coord.lat},${data.coord.lon}`;

    // Reply with the constructed message
    msg.reply(caption);
  }
}
