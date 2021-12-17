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
exports.onlyAdmin = () => {
  return `[❕] Perintah ini hanya bisa di gunakan oleh admin grup.`
}
exports.onlyBotAdmin = () => {
  return `[❕] Perintah ini hanya bisa di gunakan jika bot telah menjadi admin grup.`
}
exports.needTag = () => {
  return `[❕] Tag orangnya!`
}
exports.useCountryNum = () => {
  return `[❕] Gunakan kode negara!`
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
exports.ghstalk = (user, bio, company, email, twit, pr, pg, follower, following, loc) => {
  return `
╭﹝🄶🄷 🅂🅃🄰🄻🄺﹞
├ Pengguna : ${user}
├ Bio : ${bio}
├ Perusahaan : ${company}
├ Email : ${email}
├ Nama Pengguna Twitter : ${twit}
├ Repo Publik : ${pr}
├ Gists Publik : ${pg}
├ Pengikut : ${follower}
├ Mengikuti : ${following}
├ Lokasi : ${loc}
╰─────────────
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

// Invalid
exports.invalidLink = () => {
  return `[❕] Link salah!`
}
