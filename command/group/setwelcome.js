module.exports = {
  name: "setwelcome",
  alias: ["setwc"],
  category: "group",
  use: "<caption/withprofile> <query>",
  isGroup: true,
  isAdmin: true,

  // Asynchronous run function to handle the command logic
  async run({ msg }, { args, query }) {
    // Check if there are enough arguments
    if (args.length < 2) {
      await send(chat.minWord, msg.key);
    }

    // Get the current state of the welcome feature for the group or initialize an empty object
    const welcome = group[msg.from].welcome ? group[msg.from].welcome : group[msg.from].welcome = {};

    // Check if the welcome feature is available
    if (welcome) {
      switch (args[0]) {
        case 'caption':
          // Set the caption for the welcome message
          let toarray = query.split(' ').slice(1);
          let q = toarray.join(' ');
          group[msg.from].welcome.caption = q;
          break;
        case 'withprofile':
          // Get the current state of withProfile or initialize it
          let wp = group[msg.from].welcome.withProfile;

          // Switch statement to handle different subcommands
          switch (args[1]) {
            case 'on':
            case 'aktif':
              // Enable withProfile if not already enabled
              if (wp) return await send(chat.hasOn, msg.key);
              group[msg.from].welcome.withProfile = true;
              break;
            case 'off':
            case 'mati':
              // Disable withProfile if not already disabled
              if (!wp) return await send(chat.hasOff, msg.key);
              group[msg.from].welcome.withProfile = false;
              break;
            default:
              // Set withProfile based on its current state if the subcommand is not recognized
              if (wp) {
                group[msg.from].welcome.withProfile = true;
              } else {
                group[msg.from].welcome.withProfile = false;
              }
          }
          break;
        default:
          // Inform the user if the subcommand is not recognized
          await send(chat.minWord, msg.key);
      }

      // Save the updated group data to the database
      db.save('group', group);
    }
  }
};
