/**
 * Returns the first truthy value from the provided arguments.
 * If all arguments are falsy, returns the last argument.
 * @param  {...any} arguments - The values to check.
 * @returns {any} The first truthy value, or the last argument if all are falsy.
 */
function or() {
  for (let arg of arguments) {
    if (arg) return arg;
  }
  return arguments[arguments.length - 1];
}

/**
 * Merges provided options with default options, prioritizing provided options.
 * @param {object} defaultOptions - The default options.
 * @param {object} providedOptions - The provided options.
 * @returns {object} Merged options.
 */
function parseOptions(defaultOptions = {}, providedOptions = {}) {
  let options = {};
  let entries = Object.entries(defaultOptions);

  for (let i = 0; i < Object.keys(defaultOptions).length; i++) {
    let [key, val] = entries[i];
    options[key] = or(providedOptions[key], val);
  }

  return options;
}

// Exported functions
module.exports = { or, parseOptions };
