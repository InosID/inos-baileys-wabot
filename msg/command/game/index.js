let fs = require('fs')
let toMs = require('ms')
let { tekateki } = require('./database')

function addGame(chatId, answer, expired, arr) {
  var obj = {
    id: chatId,
    answer: answer,
    expired: Date.now() + toMs(`${expired}s`)
  }
  arr.push(obj)
}

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

function isGame(chatId, arr) {
  let status = false;
  Object.keys(arr).forEach((i) => {
    if (arr[i].id === chatId) {
      status = true;
    }
  });
  return status
}

function checkGameTime(CXD, arr) {
  setInterval(() => {
    let position = null;
    Object.keys(arr).forEach((i) => {
      if (Date.now() >= arr[i].expired) {
        position = i;
      }
    });
    if (position !== null) {
      CXD.reply(`*Times Out!*\n\n*Answer :* ${arr[position].answer}`)
      arr.splice(position, 1);
    }
  }, 1000);
}

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

module.exports = {
  addGame,
  getGameAnswer,
  isGame,
  checkGameTime,
  getGamePosi
}
