// Import required modules
const googlethis = require('googlethis');
const { lyrics, azlyrics } = require('../../lib/scrape');
const IkyyClient = require("ikyy");

// Create an instance of IkyyClient
const iky = new IkyyClient();

// Define Google search options
const googleSearchOptions = {
  page: 0,
  safe: false,
  additional_params: {
    hl: "id",
  },
};

// Export module for the "whatmusic" command
module.exports = {
  name: "whatmusic",
  alias: ["wmc", "whatsmusic"],
  category: "search",

  // Asynchronous run function to handle the command logic
  async run({ msg }) {
    // Destructure properties from the msg object
    const { isQAudio, isQVideo, isVideo } = msg;

    // Check if the message contains audio, video, or is a video
    if (isQAudio || isQVideo || isVideo) {
      // Download the media file based on the message type
      const data = isVideo ? await msg.download() : await msg.quoted.download();

      // Perform music recognition using IkyyClient
      const what = await iky.search.whatmusic(data);

      // Check if the title is undefined, indicating that the music could not be recognized
      if (what.title === undefined) {
        return msg.reply(chat.command.whatmusic.notfound);
      }

      // Remove the 'status' property from the 'what' object
      delete what.status;

      // Destructure properties from the 'what' object
      const { artists, score, sumber } = what;

      // Search for song lyrics
      let lyric = "";

      try {
        const title = `${what.title} ${artists}`;
        const dataLyrics = await lyrics(title);

        if (dataLyrics.lyrics === '\n' || !dataLyrics.lyrics) {
          const azResults = await azlyrics.searchSong(title);

          if (!azResults.songs[0]) {
            const googleSearch = await googlethis.search(`lirik ${title}`, googleSearchOptions);
            const knowledge = await googleSearch.knowledge_panel;

            lyric = knowledge.lyrics || "";
          } else {
            const azLyricsUrl = azResults.songs[0].url;
            lyric = (await azlyrics.getLyrics(azLyricsUrl)).lyricsList || "";
          }
        } else {
          lyric = `Lyrics:\n${dataLyrics.lyrics}`;
        }
      } catch {
        // Handle errors by providing a default value
        lyric = "";
      }

      // Create a caption with replaced placeholders
      const caption = chat.command.whatmusic.content
        .replace(':score:', score)
        .replace(':title:', what.title)
        .replace(':artists:', artists)
        .replace(":source:", sumber === "Tidak diketahui" ? "." : `.\n${sumber}`)
        .replace(':lyrics:', lyric);

      // Reply to the user with the generated caption
      return msg.reply(caption);
    } else {
      // Inform the user that the command can only be used on audio or video messages
      await send(chat.onlyAudioVideo, msg.key);
    }
  }
};
