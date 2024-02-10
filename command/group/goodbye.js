module.exports = {
  name: "goodbye",
  alias: [],
  category: "group",
  use: "<on/off>",
  isGroup: true,
  isAdmin: true,

  // Asynchronous run function to handle the command logic
  async run({ msg }, { args, query }) {
    // Check if there are enough arguments
    if (args.length < 1) {
      await send(chat.minword, msg.key);
    }

    // Get the current state of the goodbye feature for the group
    const isGoodbye = group[msg.from].goodbye ? group[msg.from].goodbye : false;

    // Switch statement to handle different subcommands
    switch (args[0]) {
      case 'on':
      case 'aktif':
        // Enable the goodbye feature if not already enabled
        if (isGoodbye) return await send(chat.hasOn, msg.key);
        group[msg.from].goodbye = {
          caption: "Sayonara...",
          withProfile: true,
        };
        break;
      case 'off':
      case 'mati':
        // Disable the goodbye feature if not already disabled
        if (!isGoodbye) return await send(chat.hasOff, msg.key);
        delete group[msg.from].goodbye;
        break;
      default:
        // Provide an example if the subcommand is not recognized
        msg.reply('example: goodbye on/off');
    }

    // Save the updated group data to the database
    db.save('group', group);
  }
};
