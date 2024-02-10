module.exports = {
  // Command details
  name: "delete",
  alias: ["del"],
  desc: "Delete message",
  category: "main",
  cooldown: 5,
  isSpam: true,
  // Command execution
  async run({ msg }, { send, users, isAdmin, isBotAdmin }) {
    // Check if there is a quoted message
    if (!msg.quoted) return await send(chat.needReplyMessage, msg.key);

    // Check admin privileges and bot admin status
    if (isAdmin && isBotAdmin) {
      // Delete the quoted message
      return msg.quoted.delete();
    } else if (!isAdmin && !isBotAdmin && !msg.quoted.isSelf) {
      // If not an admin and not a bot admin, and the quoted message is not sent by the bot
      return await send(chat.onlyBotOwnMessage, msg.key);
    }

    // Delete the quoted message
    return msg.quoted.delete();
  },
};
