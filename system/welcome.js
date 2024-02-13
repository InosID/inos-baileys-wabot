const { readFileSync: read } = require('fs')

module.exports = async function(conn, m) {
  try {
    let metadata = await conn.groupMetadata(m.id);
    let name = metadata.subject;
    let desc = metadata.desc;

    let group = JSON.parse(read('./database/group.json'))[m.id]
    let participants = m.participants;
    let isWelcome = group.welcome ? group.welcome : false;
    let isGoodbye = group.goodbye ? group.goodbye : false;
    let welcomeText = isWelcome && group.welcome.caption ? group.welcome.caption : "";
    let goodbyeText = isGoodbye && group.goodbye.caption ? group.goodbye.caption : "";

    if (isWelcome || isGoodbye) {
      let ppimg;
      for (let num of participants) {
        try {
          ppimg = await conn.profilePictureUrl(num, "image");
        } catch {
          ppimg = "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
        }

        switch(m.action) {
          case "add":
            if (!isWelcome) return
            var caption = welcomeText
              .replace(':gcname:', name)
              .replace(':user:', '@' + num.split("@")[0])
              .replace(':desc:', desc);
            if (group.welcome.withProfile) {
              await conn.sendMessage(m.id, {
                text: caption,
                contextInfo: {
                  externalAdReply: {
                    title: "WELCOME",
                    body: "",
                    mediaType: 1,
                    mediaUrl: ppimg,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                    thumbnail: await getBuffer(ppimg),
                    sourceUrl: "",
                  },
                  mentionedJid: [num],
                },
              });
            } else {
              conn.sendMessage(
                m.id,
                {
                  text: caption,
                  contextInfo: {
                    mentionedJid: [num]
                  }
                }
              )
            }
            break
          case 'remove':
            if (!isGoodbye) return
            var caption = goodbyeText
              .replace(':gcname:', name)
              .replace(':user:', '@' + num.split("@")[0])
              .replace(':desc:', desc);
            if (group.goodbye.withProfile) {
              await conn.sendMessage(m.id, {
                text: caption,
                contextInfo: {
                  externalAdReply: {
                    title: "GOODBYE",
                    body: "",
                    mediaType: 1,
                    mediaUrl: ppimg,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                    thumbnail: await getBuffer(ppimg),
                    sourceUrl: "",
                  },
                  mentionedJid: [num],
                },
              });
            } else {
              conn.sendMessage(m.id, {
                text: goodbyeText,
                contextInfo: {
                  mentionedJid: [num],
                }
              })
            }
            break
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

async function getBuffer (url, options) {
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