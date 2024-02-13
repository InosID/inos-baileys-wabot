const wikipedia = require("./lib/scrape/wikipedia");

(async() => {
  wikipedia('Indonesia').then(console.log)
})()