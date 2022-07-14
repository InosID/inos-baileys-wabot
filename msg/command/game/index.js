let fs = require('fs')
let toMs = require('ms')
let tbkanime = require('./anime')

// Game function

/** Add game to array
 * @param {String} chatId
 * @param {String} answer
 * @param {String} expired
 * @param {Object} arr
 */
function addGame(chatId, answer, expired, arr) {
  var obj = {
    id: chatId,
    answer: answer,
    expired: Date.now() + toMs(`${expired}s`)
  }
  arr.push(obj)
}

/** Get game answer
 * @param {String} chatId
 * @param {Object} arr
 * @returns {String}
 */
function getGameAnswer(chatId, arr) {
  let found = false;
  Object.keys(arr).forEach((i) => {
    if (arr[i].id === chatId) {
      found = i;
    }
  });
  if (found !== false) {
    return arr[found].answer;
  }
}

/** is game
 * @param {String} chatId
 * @param {Object} arr
 * @returns {Boolean}
 */
function isGame(chatId, arr) {
  let status = false;
  Object.keys(arr).forEach((i) => {
    if (arr[i].id === chatId) {
      status = true;
    }
  });
  return status
}

/** Check game time
 * @param {Function} CXD
 * @param {Object} arr
 */
function checkGameTime(CXD, timeoutText, arr) {
  setInterval(() => {
    let position = null;
    Object.keys(arr).forEach((i) => {
      if (Date.now() >= arr[i].expired) {
        position = i;
      }
    });
    if (position !== null) {
      CXD.reply(timeoutText)
      arr.splice(position, 1);
    }
  }, 1000);
}

/** Get game position
 * @param {String} chatId
 * @param {Object} arr
 * @returns {Array}
 */
function getGamePosi(chatId, arr) {
  let position = null;
  Object.keys(arr).forEach((i) => {
    if (arr[i].id === chatId) {
      position = i;
    }
  });
  if (position !== null) {
    return position;
  }
}

/** Get game multi answer
 * @param {String} chatId
 * @param {String} answ
 * @param {Object} arr
 * @returns {Boolean}
 */
function getGameMultiAnswer(chatId, answ, arr) {
  let position = false;
  Object.keys(arr).forEach((i) => {
    if (arr[i].answer === answ) {
      position = i 
    }
  });
  if (position !== false) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  addGame,
  getGameAnswer,
  isGame,
  checkGameTime,
  getGamePosi,
  getGameMultiAnswer,
  tbkanime
}
