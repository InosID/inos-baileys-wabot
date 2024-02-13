const caliph = require('caliph-api');

module.exports = {
  name: "chord", // Command name
  alias: [], // Aliases for the command
  use: "query", // How the command is used
  category: "search", // Command category
  isQuery: true, // Indicates if it's a query command
  async run({ msg }, { query }) {
    // Run function for the command
    // 'msg' contains message-related data, 'query' contains query-related data
    
    try {
      // Search for chord information using 'caliph' library
      let data = await caliph.search.chordlagu(query);

      // If no result found, send a message indicating not found
      if (!data.result) return await send(chat.notFoundQuery, msg.key);
    
      // Extract chord information from the result
      let str = data.result.content;

      // Reply with the chord information
      msg.reply(str);
    } catch {
      // Handle errors
      msg.reply(chat.notFoundQuery);
    }
  }
}
