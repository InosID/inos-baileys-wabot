module.exports = {
  name: "welcome",
  alias: [],
  category: "group",
  use: "<on/off>",
  isGroup: true,
  isAdmin: true,

  // Asynchronous run function to handle the command logic
  async run({ msg }, { args }) {
    // Check if there are enough arguments
    if (args.length < 1) {
      await send(chat.minWord, msg.key);
    }

    // Get the current state of the welcome feature for the group
    const isWelcome = group[msg.from].welcome ? group[msg.from].welcome : false;

    // Switch statement to handle different subcommands
    switch (args[0]) {
      case 'on':
      case 'aktif':
        // Enable the welcome feature if not already enabled
        if (isWelcome) return await send(chat.hasOn, msg.key);
        group[msg.from].welcome = {
          caption: "Hi, :user: welcome!",
          withProfile: true,
        };
        msg.reply('sukses');
        break;
      case 'off':
      case 'mati':
        // Disable the welcome feature if not already disabled
        if (!isWelcome) return await send(chat.hasOff, msg.key);
        delete group[msg.from].welcome;
        msg.reply('sukses');
        break;
      default:
        // Provide an example if the subcommand is not recognized
        msg.reply('example: welcome on/off');
    }

    // Save the updated group data to the database
    db.save('group', group);
  }
};
