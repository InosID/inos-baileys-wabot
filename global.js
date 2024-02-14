const fs = require('fs');

/**
 * Function to pick a random element from an array.
 * @param {Array} array - The input array.
 * @returns {*} The randomly selected element from the array.
 */
global.pickRandom = function(array = []) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Function to check if a string starts with a specified prefix.
 * Supports both string and regex prefixes.
 * @param {string|Array|RegExp} prefix - The prefix or array of prefixes to check.
 * @param {string} body - The string to check for the prefix.
 * @returns {Object|false} An object with match information if a match is found, otherwise false.
 */
global.checkPrefix = function(prefix, body = '') {
  if (!body) return false;

  if (typeof prefix == "string") {
    // Handling string prefix
    return {
      match: body.startsWith(prefix),
      prefix: prefix,
      body: body.replace(prefix, ""),
    };
  } else if (typeof prefix == "object") {
    // Handling array of string prefixes or regex prefixes
    if (Array.isArray(prefix)) {
      for (const value of prefix) {
        if (typeof value == "string") {
          if (body.startsWith(value))
            return {
              match: true,
              prefix: value,
              body: body.replace(value, ""),
            };
        } else if (typeof value == "object") {
          if (value instanceof RegExp) {
            if (body.match(value))
              return {
                match: true,
                prefix: value.exec(body)?.[0],
                body: body.replace(value, ""),
              };
          }
        }
      }
    } else if (prefix instanceof RegExp) {
      // Handling regex prefix
      if (body.match(prefix))
        return {
          match: true,
          prefix: prefix.exec(body)?.[0],
          body: body.replace(prefix, ""),
        };
    }
  }
  return false;
}

/**
 * Function to reload a module when changes are detected.
 * @param {string} file - The path to the module file.
 * @param {Object} options - Additional options for reloading.
 */
global.reloadFile = function(file = '', options = {}) {
  nocache(file, () => {
    console.log(`File "${file}" has been updated!\nRestarting!`);
    process.send("reset");
  });
};

/**
 * Internal function to watch file changes and trigger a callback.
 * @param {string} module - The path to the module file.
 * @param {Function} cb - The callback function to execute on file change.
 */
function nocache(module, cb = () => {}) {
  fs.watchFile(require.resolve(module), async () => {
    await uncache(require.resolve(module));
    cb(module);
  });
}

/**
 * Internal function to remove a module from the cache.
 * @param {string} module - The path to the module file.
 * @returns {Promise} A promise that resolves when the module is removed from the cache.
 */
function uncache(module = ".") {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(module)];
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Function to check if a string is a valid URL.
 * @param {string} url - The input string to check.
 * @returns {boolean} True if the input is a valid URL, false otherwise.
 */
global.isUrl = function(url) {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, "gi"));
}

/**
 * Function to find a link in a given string matching a specified URL.
 * @param {string} q - The input string to search for a link.
 * @param {string} url - The URL to match against.
 * @returns {string|null} The found link or null if not found.
 */
global.findLink = function(q, url) {
  if (isUrl(q)) {
    let search = isUrl(q);
    let link = search.find((a) => a.includes(url));
    return link;
  }
}
