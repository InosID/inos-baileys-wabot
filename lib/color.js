const chalk = require('chalk')

/**
 * Create text with color
 * @param {string} text
 * @param {string} color
 * @returns {Number}
 */
const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

/**
 * Create text with background color
 * @param {string} text
 * @param {string} bgcolor
 * @returns {Number}
 */
const bgcolor = (text, bgcolor) => {
  return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

module.exports = { color, bgcolor }
