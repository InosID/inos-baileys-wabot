async function result(teks) {
  teks = teks.replace(/[a]/g,"i")
  teks = teks.replace(/[e]/g,"i")
  teks = teks.replace(/[o]/g,"i")
  teks = teks.replace(/[u]/g,"i")
  teks = teks.replace(/[A]/g,"I")
  teks = teks.replace(/[E]/g,"I")
  teks = teks.replace(/[O]/g,"I")
  teks = teks.replace(/[U]/g,"I")
  return { result: teks }
}

module.exports = { result }
