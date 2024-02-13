module.exports = {
  name: 'setlanguage',
  alias: ['setlang', 'setbahasa', 'aturbahasa'],
  category: 'user',
  use: "<indonesia/english>",
  async run({ msg }, { query }) {
    // Mendapatkan bahasa saat ini dari pengguna
    let lang = user[msg.sender].language;

    // Mengecek query dan mengganti bahasa sesuai dengan preferensi pengguna
    switch (lang) {
      case 'id':
        if (query.match(/\b(?:indonesia|indo(?:nesia)?|idn|id)\b/i)) {
          msg.reply('Sudah dalam bahasa Indonesia.');
        } else {
          user[msg.sender].language = 'en';
          msg.reply('Berhasil beralih ke bahasa Inggris.');
        }
        break;
      case 'en':
        if (query.match(/\b(?:[ei]ng(lish|gris)|[ei]ng(?:lish|gris)?|en)\b/i)) {
          msg.reply('Already in English.');
        } else {
          user[msg.sender].language = 'id';
          msg.reply('Successfully switched to Indonesian.');
        }
        break;
      default:
        // Bahasa default jika pengguna belum memiliki preferensi
        if (query.match(/\b(?:indonesia|indo(?:nesia)?|idn|id)\b/i)) {
          user[msg.sender].language = 'id';
          msg.reply('Berhasil beralih ke bahasa Indonesia.');
        } else {
          user[msg.sender].language = 'en';
          msg.reply('Successfully switched to English.');
        }
    }

    // Menyimpan perubahan preferensi bahasa ke database
    db.save('user', user);
  }
}
