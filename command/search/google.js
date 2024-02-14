// const engine = require("cdrake-se/Engines/Google");
// const go = require('googlethis');
// const PhoneNumber = require('awesome-phonenumber');
// const CountryLanguage = require("country-language");

// module.exports = {
//   name: "google", // Command name
//   alias: [], // Aliases for the command
//   use: "query", // How the command is used
//   category: "search", // Command category
//   cooldown: 5, // Command cooldown
//   isSpam: true, // Indicates if it's a spam command
//   isQuery: true, // Indicates if it's a query command

//   async run({ msg }, { query }) {
//     // Get region code from sender's phone number
//     var region = await PhoneNumber("+" + msg.sender.split("@")[0]).getRegionCode();

//     // Get country information based on region
//     var Country = await CountryLanguage.getCountry(region);

//     // Options for Google search
//     const options = {
//       page: 0,
//       safe: false,
//       additional_params: {
//         hl: user.language, // Language for search
//       },
//     };

//     // Initialize Google search engine
//     const google = new engine({
//       Query: query, // Query to search
//       Page: 1, // Page number
//       Language: Country.langCultureMs[0].langCultureName // Language for search
//         ? Country.langCultureMs[0].langCultureName
//         : "id-ID", // Default language if not available
//     });

//     // Perform Google search
//     const search = await google.Search();

//     // Perform Google search using 'googlethis' library
//     let searchResult = await go.search(query, options);

//     // Extract relevant information from the search result
//     let knowledgePanel = await searchResult.knowledge_panel;
//     let translation = await searchResult.translation;
//     let searchResults = search.Results.slice(0, 7);

//     // Construct the reply message
//     let replyMessage = `*G O O G L E*\nSekitar ${search.TotalIndexedResults} hasil (${search.SearchTimeout})\n`;
//     replyMessage += knowledgePanel.title ? `*${knowledgePanel.title}* (${knowledgePanel.type})\n` : "";
//     replyMessage += knowledgePanel.description ? `${knowledgePanel.description}\n` : "";
//     for (var metadata of knowledgePanel.metadata) {
//       replyMessage += `${metadata.title ? `*${metadata.title}*` : ""} : ${metadata.value ? `${metadata.value}\n` : ""}`;
//     }
//     replyMessage += knowledgePanel.lyrics !== null ? `${knowledgePanel.lyrics}\n` : "";
//     replyMessage += translation.source_language !== null ? `*Translate*\n${translation.source_language} - ${translation.target_language}\n${translation.source_text}\n${translation.target_text}\n\n` : "";
//     for (var result of searchResults) {
//       replyMessage += `*${result.Title}*\n${result.Description}\n${result.Link}\n\n`;
//     }

//     // Include related questions if available
//     if (searchResult.people_also_ask[0]) {
//       replyMessage += "*Pertanyaan terkait*\n";
//       for (var question of searchResult.people_also_ask) {
//         replyMessage += `${question ? `• ${question}\n` : ""}`;
//       }
//     }

//     // Reply with the constructed message
//     msg.reply(replyMessage);
//   }
// }
