async function result(teks) {
  teks = teks.replace(/[e]/g,"a")
  teks = teks.replace(/[o]/g,"a")
  teks = teks.replace(/[u]/g,"a")
  teks = teks.replace(/[E]/g,"A")
  teks = teks.replace(/[O]/g,"A")
  teks = teks.replace(/[U]/g,"A")
  return { result: teks }
}

module.exports = { result }
