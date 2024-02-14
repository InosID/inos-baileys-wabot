function language(msg) {
  let defaultLanguage = setting.bot.defaultLanguage;
  let userLanguage = user[msg.sender].language;
  let JSON;
  if (userLanguage === "id") {
    JSON = db.read('language/indonesia')
  } else if (userLanguage === 'en') {
    JSON = db.read('language/english')
  } else if (defaultLanguage.match(/\b(?:indonesia|indo(?:nesia)?|idn|id)\b/i)) {
    JSON = db.read('language/indonesia')
  } else {
    JSON = db.read('language/english')
  }
  return JSON;
}

module.exports = language