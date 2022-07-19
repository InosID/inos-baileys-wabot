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
exports.needReplyOrSendImg = () => {
  return `[❕] Kirim gambar atau balas gambar dengan caption !sticker [packname]|[authorname]`
}
exports.needReplyOrSendVid = () => {
  return `[❕] Kirim video atau balas video dengan caption !sticker [packname]|[authorname]`
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
exports.yt4res = (res) => {
  return `
╭﹝🅈🅃🄼🄿④﹞
├ Judul : ${res[0].judul}
├ Kualitas : ${res[0].quality}
├ Ukuran : ${res[0].size}
├ Tipe : ${res[0].tipe}
╰─────────
`
}
exports.gameQuestion = (p, gameTime) => {
  return `
╭﹝🄶🄰🄼🄴﹞
├ *Soal :* ${p.soal}
├ *Waktu :* ${gameTime}s
├ *Note* : Reply pertanyaan ini untuk menjawab.
╰────────`
}
exports.unsolvedQuestion = () => {
  return `Masih ada pertanyaan yang belum diselesaikan!`
}
exports.gameCorrectAnswer = () => {
  return `✅ Jawaban benar!`
}
exports.gameWrongAnswer = () => {
  return `❎ Jawaban salah!`
}
exports.gameWrongAnswerEnd = (answer) => {
  return `❎ Jawaban salah!\nJawabannya adalah : ${answer}`
}
exports.gameTimeout = (answer) => {
  return `
╭﹝🄶🄰🄼🄴﹞
├ *Waktu habis!*
├ *Answer :* ${answer}
╰────────`
}
exports.igstory = (username, data) => {
  return `
╭🄸🄶 🅂🅃🄾🅁🅈﹞
├ Nama : ${username}
├ Ditemukan : ${data.length}
├ Lainnya :`
}

// Feature
exports.nsfwHasOn = () => {
  return `[❕] Nsfw telah aktif sebelumnya.`
}
exports.nsfwOff = () => {
  return `[❕] Nsfw belum diaktifkan.`
}
exports.welcomeHasOn = () => {
  return `[❕] Welcome telah aktif sebelumnya.`
}
exports.welcomeOff = () => {
  return `[❕] Welcome belum diaktifkan.`
}

// Invalid
exports.invalidLink = () => {
  return `[❕] Link salah!`
}
exports.invalidFileType = () => {
  return `[❕] Tipe File Salah!`
}
exports.invalidQuery = () => {
  return `[❕] Tidak dapat menemukan query ini!`
}
