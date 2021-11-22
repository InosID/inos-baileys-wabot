// Actions
exports.wait = () => {
  return
    `[⏳] Tunggu sebentar...`
}

// Permission
exports.notAllowed = () => {
  return
    `[❕] Perintah ini tidak diizinkan oleh owner.`
}

// Require
exports.needQuery = () => {
  return
    `[❕] Parameter query tidak ditemukan.`
}
exports.needLink = () => {
  return
   `[❕] Parameter link tidak ditemukan.`
}
