module.exports = {
  // Command details
  name: "help",
  alias: ["menu", "allmenu"],
  desc: "",
  use: "",
  type: "",
  category: "main",
  example: "",

  // Command execution function
  async run({ msg }, { map }) {
    const { command } = map;
    const cmds = command.keys();
    let category = {};

    // Organize commands by category
    for (let cmd of cmds) {
      let info = command.get(cmd);
      // Skip invalid or hidden commands
      if (!cmd || ["umum", "hidden"].includes(info.category?.toLowerCase()) || info.type === "changelog") continue;

      let categ = info.category || "No Category";
      if (!categ || categ === "private") categ = "owner";

      // Organize commands by category
      if (category[categ]) {
        category[categ].push(info);
      } else {
        category[categ] = [info];
      }
    }

    let str = `﹝ ${setting.bot.name} ﹞\n\n`;

    str += 'Info:\n<> : required\n[] : optional\n🕙: Wait, ❎: Failed, ✅: Success\n\n'

    // Format the response
    Object.keys(category).forEach((key) => {
      const commands = category[key];
      str += `╭⌥ *${key.toUpperCase()}*\n`;
      commands.forEach((cmd, index) => {
        const isLastCommand = index === commands.length - 1;
        const prefix = isLastCommand ? "╰" : "│";

        str += `${prefix} ⠂ ${cmd.name} ${
          cmd.category === "private" ? "" : (cmd.use || "")
        }\n`;
      });
      str += '\n'
    });

    // Send the formatted help message
    msg.reply(str);
  },
};
