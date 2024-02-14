// Importing global settings and required modules
require('../global')

const { delay } = require('@whiskeysockets/baileys')
const fs = require('fs')
const path = require('path')
const { parseOptions } = require('./utils')

/**
 * Read and load features from command files, populating a command map.
 * @param {Object} attr - The attribute object containing a 'command' map to store loaded commands.
 */
async function readFeatures(attr) {
  try {
    // Set the directory path for command files
    const pathDir = path.join(__dirname, "../command")
    // Retrieve the list of features (subdirectories) in the command directory
    const features = fs.readdirSync(pathDir)

    // Display a loading message while checking commands
    console.log("Loading... Please wait while the system checks the commands.")

    // Iterate through each feature (subdirectory)
    for (const feature of features) {
      // Retrieve the list of command files in the current feature
      const commands = fs.readdirSync(`${pathDir}/${feature}`).filter((file) => file.endsWith(".js"))

      // Iterate through each command file
      for (const file of commands) {
        // Load the command module dynamically
        const command = require(`${pathDir}/${feature}/${file}`)

        // Skip if the module does not have a 'run' function
        if (typeof command.run !== "function") continue

        // Define default command options
        const defaultCmdOptions = {
          name: "command",
          alias: [""],
          desc: "",
          use: "",
          example: "",
          url: "",
          category: typeof command.category === "undefined" ? "" : feature.toLowerCase(),
          wait: false,
          isOwner: false,
          isAdmin: false,
          isQuoted: false,
          isGroup: false,
          isBotAdmin: false,
          isQuery: false,
          isPrivate: false,
          isUrl: false,
          run: () => {},
        }

        // Parse command options, filling in defaults
        const cmdOptions = parseOptions(defaultCmdOptions, command)

        // Extract relevant options for the command map
        const options = Object.fromEntries(
          Object.entries(cmdOptions)
            .filter(([k, v]) => typeof v === "boolean" || k === "query" || k === "isMedia")
        )

        // Create an object representing the command
        const cmdObject = {
          name: cmdOptions.name,
          alias: cmdOptions.alias,
          desc: cmdOptions.desc,
          use: cmdOptions.use,
          type: cmdOptions.type,
          example: cmdOptions.example,
          url: cmdOptions.url,
          category: cmdOptions.category,
          options,
          run: cmdOptions.run,
        }

        // Add the command object to the 'command' map
        attr.command.set(cmdOptions.name, cmdObject)

        // Introduce a delay for better command loading visualization
        await delay(2000)
        
        // Reload the command file for potential updates
        global.reloadFile(`./command/${feature}/${file}`)
      }
    }

    // Display a success message after loading commands
    console.log("Loading... Command loaded successfully.")
  } catch (error) {
    // Log any errors that occur during the loading process
    console.error("Error: ", error)
  }
}

// Export the function for external use
module.exports = readFeatures
