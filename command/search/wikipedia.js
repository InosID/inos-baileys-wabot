const CountryLanguage = require('country-language');
const SearchEngine = require('cdrake-se');
const PhoneNumber = require('awesome-phonenumber');

module.exports = {
  name: "wikipedia", // Command name
  alias: ["wiki"], // Aliases for the command
  use: "query", // How the command is used
  category: "search", // Command category
  isQuery: true, // Indicates if it's a query command
  async run({ msg }, { query }) {
    // Extract region code from sender's phone number
    var region = PhoneNumber("+" + msg.sender.split("@")[0]).getRegionCode();

    // Get country information based on region
    var Country = await CountryLanguage.getCountry(region);

    // Search on Wikipedia using 'cdrake-se' library
    const wiki = await SearchEngine({
      Method: "Wikipedia", // Search method
      Query: query, // Query to search
      Page: 1, // Page number
      Language: Country.langCultureMs[0].langCultureName // Language for search
        ? Country.langCultureMs[0].langCultureName
        : "id-ID", // Default language if not available
    });

    // Constructing the reply message
    let caption = "*WIKIPEDIA*";
    caption += `\n\n*${wiki.Title.toUpperCase()}*\n${wiki.Content}\n${wiki.AdditionalURLs.Page}\n\n*Terkait :*`;
    for (var i of wiki.Related) {
      caption += `\n*${i.Title}*\n${i.Content}\n`;
    }

    // Reply with the constructed message
    msg.reply(caption);
  }
}
