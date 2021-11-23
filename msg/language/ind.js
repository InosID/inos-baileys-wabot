// Actions
exports.wait = () => {
  return `[⏳] Tunggu sebentar...`
}
exports.done = () => {
  return `[☑️] Berhasil!`
}

// Permission
exports.notAllowed = () => {
  return `[❕] Perintah ini tidak diizinkan oleh owner.`
}

// Require
exports.needQuery = () => {
  return `[❕] Parameter query tidak ditemukan.`
}
exports.needLink = () => {
  return `[❕] Parameter link tidak ditemukan.`
}

// Result
exports.yt3res = (title, quality, type, size) => {
  return `
╭﹝🅈🅃🄼🄿③﹞
├ Judul : ${title}
├ Kualitas : ${quality}
├ Tipe : ${type}
├ Ukuran : ${size}
╰────────
`
}

// Feature
exports.nsfwHasOn = () => {
  return `[❕] Nsfw telah aktif sebelumnya.`
}
exports.nsfwOff = () => {
  return `[❕] Nsfw belum diaktifkan.`
}
