// Import required modules and functions
require('./global');

const { default: Baileys, delay } = require("@whiskeysockets/baileys");
const { serialize } = require('./lib/serialize');
const Database = require('./database');

const cooldown = new Map()

// Define the main handler function
async function handler(m, conn, map) {
  try {
    // Add a delay to avoid immediate processing
    // await delay(2000);

    // Check if the message type is "notify"
    if (m.type !== "notify") return;

    // Serialize the message and handle some message properties
    let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
    if (!msg.message) return;
    if (msg.key && msg.key.remoteJid === "status@broadcast") return;
    if (!msg.type || msg.type === "protocolMessage" || msg.type === "senderKeyDistributionMessage") return;

    // Extract relevant information from the message
    const { isGroup, sender, body, from, key, quoted } = msg;

    // Function to get admin users in a group
    async function getAdmin() {
      try {
        const groupMetadata = await conn.groupMetadata(from);
        const admins = groupMetadata.participants.filter(participant => participant.admin).map(admin => admin.id);
        return admins;
      } catch (error) {
        throw error;
      }
    }

    // Check if the sender is an admin, if the chat is private, and if the bot is an admin
    const admins = isGroup ? await getAdmin() : [];
    const isAdmin = isGroup ? admins.includes(sender) : false;
    const isPrivate = from.endsWith("@s.whatsapp.net");
    const isBotAdmin = isGroup ? admins.includes(conn.decodeJid(conn.user.id)) : false;

    // Check if the message is from a bot and return if true
    msg.isBot = ["BAE5", "3EB0", "FOKUSID"].some(prefix => key.id.startsWith(prefix) && key.id.length === prefix.length);

    if (msg.isBot) return;

    // Process quoted messages and update 'body' and 'message'
    if (quoted && body === ".." && ["conversation", "extendedTextMessage", "imageMessage", "videoMessage", "documentMessage", "audioMessage"].includes(quoted.mtype)) {
      body = quoted.mtype === "conversation" ? quoted.message?.conversation : quoted.message[quoted.mtype]?.caption || quoted.message[quoted.mtype]?.text || quoted.message["viewOnceMessageV2"]?.message["imageMessage"]?.caption || quoted.message["viewOnceMessageV2"]?.message["videoMessage"]?.caption || "";
      message = quoted.message;
    }

    // Define regular expressions for checking prefixes
    const prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi.test(body) ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#%^&.©^]/gi)[0] : "#";

    // Extract additional information from the message
    const clean = body.replace(prefix, "");
    const query = clean.trim().split(/ +/).slice(1).join(" ");
    const arg = body.substring(body.indexOf(" ") + 1);
    const args = body.trim().split(/ +/).slice(1);
    const comand = body.trim().split(/ +/)[0].toLowerCase();
    
    // Extract the command name from the message
    const cmdName = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    msg.command = cmdName;

    // Get the command from the map
    const cmd = map.command.get(comand) || [...map.command.values()].find(x => x.alias.includes(comand)) || map.command.get(cmdName) || [...map.command.values()].find(x => x.alias.includes(cmdName));

    // Initialize global database and setting variables
    global.db = new Database(msg, cmd, query)
    global.setting = db.read('setting');
    global.bot = db.read('bot');

    const owner = setting.bot.owner.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net");
    const isOwner = owner.includes(sender);

    global.botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    global.group = db.read('group');
    if (!global.group[from] && isGroup) {
      global.group[from] = { id: from };
      db.save('group', group);
    }

    global.user = db.read('user');
    if (!global.user[sender]) {
      global.user[sender] = { id: sender };
      db.save('user', user);
    }

    // Initialize global variables from setting
    global.chat = require('./language')(msg)
    global.largeFileSize = chat.largeFileSize;
    global.failed = chat.failed;
    global.missingMedia = chat.missingMedia;
    global.onlyImageMedia = chat.onlyImageMedia;
    global.needUrlFrom = chat.needUrlFrom;
    global.success = chat.success;
    global.notFoundQuery = chat.notFoundQuery;
    global.onlyStickerImage = chat.onlyStickerImage;

    // Auto-read messages if enabled
    if (bot.autoRead) await conn.readMessages([msg.key]);

    // Function to send emotes and reply based on chat settings
    global.send = async function (chatDB, key) {
      try {
        const emote = chatDB.emote ? chatDB.emote : null;
        const text = chatDB.text ? chatDB.text : null;
        const react = chatDB.react ? chatDB.react : false;

        const reactionMessage = {
          react: { text: emote, key }
        };

        if (react && emote !== "" && typeof emote === 'string') {
          conn.sendMessage(from, reactionMessage);
        }
        if (typeof text === 'string' && text !== "") {
          return msg.reply(text);
        } else if (Array.isArray(text)) {
          return msg.reply(global.pickRandom(text));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (!cmd) {
      require('./system/play')({ msg, conn });
    }
    require('./system/tictactoe')(msg, conn);

    if (cmd) {
      // Wait
      await send(chat.wait, msg.key);

      // Group chat only
      if (!isGroup && bot.groupChatOnly) await send(chat.modeGroup, msg.key);

      // Check and handle anti-spam
      if (!cooldown.has(sender)) {
        cooldown.set(sender, new Map());
      }
      const now = Date.now();
      const timestamps = cooldown.get(sender);
      const cdAmount = (cmd.options.cooldown || 2) * 1000;
      if (timestamps.has(sender)) {
        const expiration = timestamps.get(sender) + cdAmount;
        if (now < expiration) {
          let timeLeft = (expiration - now) / 1000;
          db.setTimeLeft(timeLeft)
          return await send(chat.spam, msg.key);
        }
      }

      setTimeout(() => timestamps.delete(sender), cdAmount);

      // Check and handle command requirements
      if (cmd.options) {
        if (cmd.options.isSpam) {
          timestamps.set(sender, now);
        }

        const onlyOwner = chat.onlyOwner;
        if (cmd.options.isOwner && !isOwner && !msg.isSelf) {
          await send(onlyOwner, msg.key);
          return;
        }

        const cmdOnlyGroup = chat.cmdOnlyGroup;
        if (cmd.options.isGroup && !isGroup) {
          await send(cmdOnlyGroup, msg.key);
          return;
        }

        const onlyAdmin = chat.cmdAdmin;
        if (cmd.options.isAdmin && !isAdmin) {
          await send(onlyAdmin, msg.key);
          return;
        }

        const onlyBotAdmin = chat.cmdBotAdmin;
        if (cmd.options.isBotAdmin && !isBotAdmin) {
          await send(onlyBotAdmin, msg.key);
          return;
        }

        const cmdNoQuery = chat.withoutQuery;
        if (cmd.options.isQuery && !query) {
          await send(cmdNoQuery, msg.key);
          return;
        }

        const onlyPrivate = chat.cmdPrivate;
        if (cmd.options.isPrivate && !isPrivate) {
          await send(onlyPrivate, msg.key);
          return;
        }
      }

      try {
        // Run the command and handle success
        await cmd.run({ msg, conn }, { query, map, args, arg, Baileys, prefix, command: comand, cmdName, m });
        await send(global.success, msg.key);
      } catch (e) {
        // Handle command execution failure
        await send(global.failed, msg.key);
        console.error(e);
      }

      // Log command execution
      const logType = isGroup ? "[ Group ]" : "[ Private ]";
      console.log(`${logType} ${sender.split("@")[0]} - ${body} - ${msg.key.id}`);
    }
  } catch (error) {
    // Handle errors
    console.error('Error:', error.stack);
  }
}

// Export the handler function
module.exports = handler;
