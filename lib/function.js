let getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`
}

module.exports = { getRandom }
