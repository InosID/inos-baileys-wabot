const googlethis = require('googlethis');
const { azlyrics } = require('../../lib/scrape');

// Options for the Google search
const googleSearchOptions = {
  page: 0,
  safe: false,
  additional_params: {
    hl: "id",
  },
};

module.exports = {
  name: "lyrics",
  alias: ['lirik', 'lyric', 'liric', 'liriks', 'lirics', 'lyrik', 'lyriks'],
  category: "search",
  use: "<query>",
  isQuery: true,
  isSpam: true,
  cooldown: 5,
  example: "%cmd dandelion",
  
  async run({ msg }, { query }) {
    try {
      // Search for the song on Azlyrics
      let song = await azlyrics.searchSong(query);

      if (!song.songs[0]) {
        // If no direct match, perform a Google search for lyrics
        if (!song.lyrics[0]) {
          let search = await googlethis.search("lirik " + query, googleSearchOptions);
          let knowledge = await search.knowledge_panel;

          // Check if lyrics are found in the knowledge panel
          if (knowledge.lyrics == null) return await send(global.notFoundQuery, msg.key);

          return msg.reply(knowledge.lyrics);
        }

        // If lyrics are found directly on Azlyrics, retrieve and reply
        let lyric = await azlyrics.getLyrics(song.lyrics[0].url);
        msg.reply(lyric.lyricsList);
      } else {
        // If a direct match for a song is found, retrieve and reply with lyrics
        let lyric = await azlyrics.getLyrics(song.songs[0].url);
        msg.reply(lyric.lyricsList);
      }
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error response or log the details
    }
  },
};
