let fs = require('fs')
let welcomeDB = JSON.parse(fs.readFileSync('./database/welcome.json'))

/** Add group to welcome database
 * @param {String} chatId
 * @param {String} initialWelcome
 */
function addWelcome(chatId, initialWelcome) {
  var obj = {
    id: chatId,
    welcomeText: initialWelcome
  }
  welcomeDB.push(obj)
  fs.writeFileSync('./database/welcome.json', JSON.stringify(welcomeDB, null, "\t"))
}

/** Get welcome text
 * @param {String} chatId
 */
function getWelcomeText(chatId) {
  let position = false
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].id === chatId) {
      position = i;
    }
  });
  if (position !== false) {
    return welcomeDB[position].welcomeText;
  }
}

/** Set custom welcome
 * @param {String} chatId
 * @param {String} newText
 */
function setWelcome(chatId, newText) {
  let position = false
  Object.keys(welcomeDB).forEach((i) => {
    if (welcomeDB[i].from === chatId) {
      position = i;
    }
  });
  if (position !== false) {
    welcomeDB[position].welcomeText = newText;
  }
}

module.exports = { addWelcome, getWelcome, setWelcome }
