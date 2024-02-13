const { bard } = require('../../lib/scrape')

module.exports = {
  name: "bard",
  alias: [],
  category: "ai",
  use: "<query>",
  isQuery: true,
  async run({ conn, msg }, { query }) {
    COOKIE = "g.a000gQiwdKP_Kn4kMi1bgyie1mzwj0wT1Nr3eg_yyhrbMx9OLdiX_QjonPnIDXUDX8fP5hl8HAACgYKAXQSAQASFQHGX2Mi7YlrJJU0Ij9XI1jOcMuEJxoVAUF8yKrKgSmK20GLgN1O1HYvc8wT0076"
    let configuration = {
      "__Secure-1PSID": COOKIE
    }
    const b = new bard(configuration)

    if (query.split(" ").length < 2) return msg.reply(chat.command.bard.minWord)

    str = msg.isImage || msg.isQImage ? await b.ask(query + "?", {
      format: bard.JSON,
      image: msg.isImage ? await msg.download() : await msg.quoted.download()
    }) : await b.ask(query + "?", { format: bard.JSON });

    msg.reply(str.content.replace(/\*\*/gi, ""))
  }
}
