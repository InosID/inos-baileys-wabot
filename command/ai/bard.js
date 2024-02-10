const { Bard, bard } = require('../../lib')

module.exports = {
  name: "bard",
  alias: [],
  category: "ai",
  use: "<query>",
  isQuery: true,
  async run({ msg }, { query }) {
    const b = Bard()

    if (query.split(" ").length < 2) return msg.reply(chat.command.bard.minWord)

    str = msg.isImage || msg.isQImage ? await b.ask(query + "?", {
      format: bard.JSON,
      image: msg.isImage ? await msg.download() : await msg.quoted.download()
    }) : await b.ask(query + "?", { format: bard.JSON });

    msg.reply(str.content.replace(/\*\*/gi, ""))
  }
}
