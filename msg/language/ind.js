// Actions
exports.wait = () => {
  return `[⏳] Tunggu sebentar...`
}
exports.done = () => {
  return `[☑️] Berhasil!`
}
exports.kicking = () => {
  return `Mengeluarkan : `
}
exports.adding = () => {
  return `Menambahkan : `
}
exports.demoting = () => {
  return `Menurunkan jabatan : `
}
exports.promoting = () => {
  return `Menaikan jabatan : `
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
exports.onlyGroup = () => {
  return `[❕] Perintah ini hanya bisa di gunakan dalam grup.`
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
exports.sizeMax = (url) => {
  return `Ukuran file terlalu besar. Download manual file di dalam link ini.\n*Link:* ${url}`
}

// Feature
exports.nsfwHasOn = () => {
  return `[❕] Nsfw telah aktif sebelumnya.`
}
exports.nsfwOff = () => {
  return `[❕] Nsfw belum diaktifkan.`
}
