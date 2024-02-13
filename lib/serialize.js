// Import required modules and functions from the Baileys library
const {
  jidDecode,
  downloadContentFromMessage,
  getContentType,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  downloadMediaMessage,
} = (Baileys = require("@whiskeysockets/baileys"));

// Import additional modules
let path = require("path");
let fetch = require("node-fetch");
let fs = require("fs");
let { fromBuffer } = require("file-type");
let { convertImage, convertVideo } = require("./convert");
const { title } = require("process");

// Command options for image and video conversion
const cmd = {
  1: [
    "-fs 1M",
    "-vcodec",
    "libwebp",
    "-vf",
    `scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1`,
  ],
  2: ["-fs 1M", "-vcodec", "libwebp"],
};

// Function to download media content
const downloadMedia = async (message, pathFile) => {
  let type = Object.keys(message)[0];
  // Mapping of message types to MIME types
  let mimeMap = {
    imageMessage: "image",
    videoMessage: "video",
    stickerMessage: "sticker",
    documentMessage: "document",
    audioMessage: "audio",
  };

  let mes = message;

  // Handle special message types (templateMessage, buttonsMessage)
  if (type == "templateMessage") {
    mes = message.templateMessage.hydratedFourRowTemplate;
    type = Object.keys(mes)[0];
  }

  if (type == "buttonsMessage") {
    mes = message.buttonsMessage;
    type = Object.keys(mes)[0];
  }

  try {
    if (pathFile) {
      // Download and save media content to a file
      const stream = await downloadContentFromMessage(
        mes[type],
        mimeMap[type]
      );
      let buffer = Buffer.from([]);

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      await fs.promises.writeFile(pathFile, buffer);
      return pathFile;
    } else {
      // Download media content as a buffer
      const buffer = await downloadMediaMessage(mes, "buffer", {});
      return buffer;
    }
  } catch (e) {
    throw e;
  }
};

// Function to serialize incoming messages
async function serialize(msg, conn) {
  conn.decodeJid = (jid) => {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      ).trim();
    } else return jid;
  };
  conn.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
      ? Buffer.from(PATH.split`,`[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? await (res = await fetch(PATH)).buffer()
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError("Result is not a buffer");
    let type = (await fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && returnAsFilename && !filename)
      (filename = path.join(
        __dirname,
        "../temp/" + new Date() * 1 + "." + type.ext
      )),
        await fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      ...type,
      data,
    };
  };

  conn.getName = (jid, withoutContact = false) => {
    id = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            require("awesome-phonenumber")(
              "+" + id.replace("@s.whatsapp.net", "")
            ).getNumber("international")
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === conn.decodeJid(conn.user.id)
          ? conn.user
          : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      require("awesome-phonenumber")(
        "+" + jid.replace("@s.whatsapp.net", "")
      ).getNumber("international")
    );
  };
  conn.getBuffer = async (url, options) => {
    try {
      options ? options : {};
      const res = await require("axios")({
        method: "get",
        url,
        headers: {
          DNT: 1,
          "Upgrade-Insecure-Request": 1,
        },
        ...options,
        responseType: "arraybuffer",
      });
      return res.data;
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  };
  conn.sendImage = async (jid, image, opts = {}) => {
    return conn.sendMessage(
      jid,
      {
        image: image,
        caption: opts.caption
          ? opts.caption
          : ''
      },
      {
        quoted: opts.quoted
          ? opts.quoted
          : false
      }
    )
  }
  conn.sendContact = async (jid, contact, quoted = false, opts = {}) => {
    let list = [];
    for (let i of contact) {
      num = typeof i == "number" ? i + "@s.whatsapp.net" : i;
      num2 = typeof i == "number" ? i : i.split("@")[0];
      list.push({
        displayName: await conn.getName(num),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${await conn.getName(
          num
        )}\nFN:${await conn.getName(
          num
        )}\nitem1.TEL;waid=${num2}:${num2}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${
          config.email
        }\nitem2.X-ABLabel:Email\nitem3.URL:${
          config.instagram
        }\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    return conn.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Kontak`,
          contacts: list,
        },
        ...opts,
      },
      {
        quoted,
      }
    );
  };
  conn.sendThumbnail = async function(jid, image, opts = {}) {
    let text = opts.text ? opts.text : ""
    let title = opts.title ? opts.title : ""
    let body = opts.body ? opts.body : ""
    let source = opts.source ? opts.source : ""
    conn.sendMessage(jid, {
      text: text,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: body,
          mediaType: 1,
          mediaUrl: image,
          renderLargerThumbnail: true,
          showAdAttribution: false,
          thumbnail: await conn.getBuffer(image),
          sourceUrl: source
        }
      }
    }, { quoted: msg })
  }
  conn.sendSticker = async (jid, url, quoted, option = {}) => {
    let ext;
    let buf = url;
    if (!Buffer.isBuffer(url)) buf = await conn.getBuffer(url);
    if (!Buffer.isBuffer(url)) ext = await fromBuffer(buf);
    if (Buffer.isBuffer(url)) ext = await fromBuffer(buf);
    url =
      ext == "mp4"
        ? await convertVideo(
            buf,
            ext.ext,
            "webp",
            cmd[parseInt(option.cmdType ? option.cmdType : 1)]
          )
        : await convertImage(
            buf,
            ext.ext,
            "webp",
            cmd[parseInt(option.cmdType ? option.cmdType : 1)]
          );
    console.log(url);
    return conn.sendMessage(
      jid,
      {
        sticker: url,
        ...option,
      },
      {
        quoted,
      }
    );
  };

  conn.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {}
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
        message.message.ephemeralMessage &&
        message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessageV2.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessageV2.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessageV2.message,
      };
    }

    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {}
    );
    await conn.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };

  conn.sendGroupV4Invite = async (
    jid,
    participant,
    inviteCode,
    inviteExpiration,
    groupName = "unknown subject",
    jpegThumbnail,
    caption = "Invitation to join my WhatsApp group",
    options = {}
  ) => {
    let msg = Baileys.proto.Message.fromObject({
      groupInviteMessage: Baileys.proto.GroupInviteMessage.fromObject({
        inviteCode,
        inviteExpiration: inviteExpiration
          ? parseInt(inviteExpiration)
          : +new Date(new Date() + 3 * 86400000),
        groupJid: jid,
        groupName: groupName
          ? groupName
          : (await conn.groupMetadata(jid)).subject,
        jpegThumbnail,
        caption,
      }),
    });
    const ms = Baileys.generateWAMessageFromContent(participant, msg, options);
    await conn.relayMessage(participant, ms.message, {
      messageId: ms.key.id,
    });
  };
 
  conn.sendFile = async (
    jid,
    path,
    filename = "",
    caption = "",
    quoted,
    ptt = false,
    options = {}
  ) => {
    let type = await conn.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString()),
        };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    let opt = {
      filename,
    };
    if (quoted) opt.quoted = quoted;
    if (!type) if (options.asDocument) options.asDocument = true;
    let mtype = "",
      mimetype = type.mime;
    if (/webp/.test(type.mime)) mtype = "sticker";
    else if (/image/.test(type.mime)) mtype = "image";
    else if (/video/.test(type.mime)) mtype = "video";
    else if (/audio/.test(type.mime))
      (mtype = "audio"), (mimetype = "audio/mpeg");
    else mtype = "document";
    conn.sendMessage(
      jid,
      {
        ...options,
        caption,
        ptt,
        fileName: filename,
        [mtype]: {
          url: pathFile,
        },
        mimetype,
      },
      {
        ...opt,
        ...options,
      }
    );
    /*
      .then(() => {
        fs.unlinkSync(pathFile);
        conn.logger.info("delete file " + pathFile);
      });*/
  };
  if (msg.key) {
    msg.id = msg.key.id;
    msg.isSelf = msg.key.fromMe;
    msg.from = msg.key.remoteJid;
    msg.isGroup = msg.from.endsWith("@g.us");
    msg.sender = msg.isGroup
      ? conn.decodeJid(msg.key.participant)
      : msg.isSelf
      ? conn.decodeJid(conn.user.id)
      : msg.from;
  }
  if (msg.message) {
    msg.type = getContentType(msg.message);
    if (msg.type === "ephemeralMessage") {
      msg.message = msg.message[msg.type].message;
      const tipe = Object.keys(msg.message)[0];
      msg.type = tipe;
      if (tipe === "viewOnceMessageV2") {
        msg.message = msg.message[msg.type].message;
        msg.type = getContentType(msg.message);
      }
    }
    if (msg.type === "viewOnceMessageV2") {
      msg.message = msg.message[msg.type].message;
      msg.type = getContentType(msg.message);
    }

    if (msg.message["viewOnceMessageV2"]?.message["imageMessage"]) {
      msg.type = "imageMessage";
    } else if (msg.message["viewOnceMessageV2"]?.message["videoMessage"]) {
      msg.type = "videoMessage";
    } else if (
      msg.message["documentWithCaptionMessage"]?.message["documentMessage"]
    ) {
      msg.type = "documentMessage";
      msg.message = msg.message["documentWithCaptionMessage"].message;
    }

    try {
      msg.mentions = msg.message[msg.type].contextInfo
        ? msg.message[msg.type].contextInfo.mentionedJid || []
        : [];
    } catch {
      msg.mentions = [];
    }
    try {
      const quoted = msg.message[msg.type].contextInfo;
      if (quoted.quotedMessage["ephemeralMessage"]) {
        const tipe = Object.keys(
          quoted.quotedMessage.ephemeralMessage.message
        )[0];
        if (tipe === "viewOnceMessageV2") {
          msg.quoted = {
            type: "viewOnceMessageV2",
            stanzaId: quoted.stanzaId,
            sender: conn.decodeJid(quoted.participant),
            message:
              quoted.quotedMessage.ephemeralMessage.message.viewOnceMessageV2
                .message,
          };
        } else {
          msg.quoted = {
            type: "ephemeral",
            stanzaId: quoted.stanzaId,
            sender: conn.decodeJid(quoted.participant),
            message: quoted.quotedMessage.ephemeralMessage.message,
          };
        }
      } else if (quoted.quotedMessage["viewOnceMessageV2"]) {
        msg.quoted = {
          type: "viewOnceMessageV2",
          stanzaId: quoted.stanzaId,
          sender: conn.decodeJid(quoted.participant),
          message: quoted.quotedMessage.viewOnceMessageV2.message,
        };
      } else if (quoted.quotedMessage["documentWithCaptionMessage"]) {
        msg.quoted = {
          type: "documentMessage",
          stanzaId: quoted.stanzaId,
          sender: conn.decodeJid(quoted.participant),
          message: quoted.quotedMessage.documentWithCaptionMessage.message,
        };
      } else {
        msg.quoted = {
          type: "normal",
          stanzaId: quoted.stanzaId,
          sender: conn.decodeJid(quoted.participant),
          message: quoted.quotedMessage,
        };
      }
      try {
        msg.quoted.mentions = quoted ? quoted.mentionedJid || [] : [];
      } catch {
        msg.quoted.mentions = [];
      }
      msg.quoted.isSelf = msg.quoted.sender === conn.decodeJid(conn.user.id);
      msg.quoted.mtype = Object.keys(msg.quoted.message).filter(
        (v) => v.includes("Message") || v.includes("conversation")
      )[0];
      msg.quoted.text =
        msg.quoted.message[msg.quoted.mtype].text ||
        msg.quoted.message[msg.quoted.mtype].description ||
        msg.quoted.message[msg.quoted.mtype].caption ||
        (msg.quoted.mtype == "templateButtonReplyMessage" &&
          msg.quoted.message[msg.quoted.mtype].hydratedTemplate[
            "hydratedContentText"
          ]) ||
        msg.quoted.message[msg.quoted.mtype] ||
        "";
      msg.quoted.key = {
        id: msg.quoted.stanzaId,
        fromMe: msg.quoted.isSelf,
        remoteJid: msg.from,
      };
      msg.quoted.delete = () =>
        conn.sendMessage(msg.from, {
          delete: msg.quoted.key,
        });
      msg.quoted.download = (pathFile) => downloadMedia(msg.quoted, pathFile);
      msg.quoted.forward = async (to) => {
        const quot = await msg.getQuotedMessage();
        if (quot == undefined)
          return {
            status: false,
            message: "No msg found!",
          };
      };
    } catch (e) {
      msg.quoted = null;
    }

    try {
      msg.body =
        msg.type == "conversation"
          ? msg.message?.conversation
          : msg.message[msg.type]?.caption ||
            msg.message[msg.type]?.text ||
            msg.message["viewOnceMessageV2"]?.message["imageMessage"]
              ?.caption ||
            msg.message["viewOnceMessageV2"]?.message["videoMessage"]
              ?.caption ||
            "";
    } catch {
      msg.body = "";
    }
    msg.getQuotedObj = msg.getQuotedMessage = async () => {
      if (!msg.quoted.stanzaId) return false;
      let q = await store.loadMessage(msg.from, msg.quoted.stanzaId, conn);
      return serialize(q, conn);
    };
    msg.reply = async (text, opt = {}) =>
      conn.sendMessage(
        msg.from,
        {
          text: require("util").format(text),
          mentions: opt.withTag
            ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
                (v) => v[1] + "@s.whatsapp.net"
              )
            : [],
          ...opt,
        },
        {
          ...opt,
          quoted: msg,
        }
      );
    msg.download = (pathFile) => downloadMedia(msg, pathFile);

    msg.isVideo =
      msg.type === "videoMessage" ||
      /video/.test(msg.message["documentMessage"]?.mimetype);
    msg.isImage =
      msg.type === "imageMessage" ||
      /image/.test(msg.message["documentMessage"]?.mimetype);
    msg.isAudio = msg.type === "audioMessage";
    msg.isDocument = msg.type === "documentMessage";
    msg.isSticker = msg.type === "stickerMessage";
    msg.isLocation = msg.type === "locationMessage";
    contentQ = msg.quoted ? JSON.stringify(msg.quoted) : [];
    msg.isQAudio =
      msg.type === "extendedTextMessage" && contentQ.includes("audioMessage");
    msg.isQVideo =
      msg.type === "extendedTextMessage" && contentQ.includes("videoMessage");
    msg.isQImage =
      msg.type === "extendedTextMessage" && contentQ.includes("imageMessage");
    msg.isQDocument =
      msg.type === "extendedTextMessage" &&
      contentQ.includes("documentMessage");
    msg.isQSticker =
      msg.type === "extendedTextMessage" && contentQ.includes("stickerMessage");
    msg.isQLocation =
      msg.type === "extendedTextMessage" &&
      contentQ.includes("locationMessage");
  }
  return msg;
}

// Exported functions
module.exports = {
  serialize,
  downloadMedia,
};