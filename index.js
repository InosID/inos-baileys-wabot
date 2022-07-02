let {
  default: makeWASocket,
  DisconnectReason,
  useSingleFileAuthState,
  fetchLatestBaileysVersion,
  AnyMessageContent,
  delay,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  makeInMemoryStore,
} = require('@adiwajshing/baileys')
let fs = require('fs')
let CFonts = require('cfonts')
let figlet = require('figlet')
let { color } = require('./lib/color')
let package = JSON.parse(fs.readFileSync('./package.json'))
let express = require('express')
let pino = require("pino")
let { Boom } = require("@hapi/boom")
let path = require("path").join;
let app = new express()
let qrcode = require('qrcode')

let QR;

let PORT = process.env.PORT || 8080 || 5000 || 3000
app.listen(PORT, () => {
  console.log(color('Localhost is running!', 'yellow'))
})

let store = makeInMemoryStore({
  logger: pino().child({
    level: 'silent',
    stream: 'store'
  })
})

async function start() {
  // banner
  console.log(color(figlet.textSync(`Inos Baileys\nWaBot`, 'Larry 3D'), 'cyan'))
  CFonts.say(`Created By : ${package.author} Team!`, {
    font: 'console',
    align: "center",
    gradient: ['yellow', 'yellow']
  })



  /** Uncache if there is file change
   * @param {string} module Module name or path
   * @param {function} cb <optional>
   */
  function nocache(module, cb = () => { }) {
    console.log("‣ Module", `'${module}'`, "is now being watched for changes")
    fs.watchFile(require.resolve(module), async () => {
      await uncache(require.resolve(module))
      cb(module)
    })
  }

  /** Uncache a module
   * @param {string} module Module name or path
   */
  function uncache(module = '.') {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(module)]
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }



  // connect to whatsapp
  async function connect() {
    let { state, saveState } = useSingleFileAuthState(path(__dirname, `./sessions.json`), pino({ level: "silent" }));
    let { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(`Using: ${version}, newer: ${isLatest}`);

    let conn = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      logger: pino({
        level: "silent"
      }),
      version
    })

    store.bind(conn.ev)

    conn.ev.on("creds.update", saveState)

    conn.ev.on("connection.update", async (up) => {
      let { lastDisconnect, connection } = up

      if (connection) {
        console.log("Connection Status: ", connection);
      }
      if (connection === "close") {
        let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (reason === DisconnectReason.badSession) {
          console.log(`Bad Session File, Please Delete sessions.json and Scan Again`);
          conn.logout();
        } else if (reason === DisconnectReason.connectionClosed) {
	  console.log("Connection closed, reconnecting....");
	  connect();
        } else if (reason === DisconnectReason.connectionLost) {
	  console.log("Connection Lost from Server, reconnecting...");
	  connect();
        } else if (reason === DisconnectReason.connectionReplaced) {
	  console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
	  conn.logout();
        } else if (reason === DisconnectReason.loggedOut) {
	  console.log(`Device Logged Out, Please Delete ${session} and Scan Again.`);
	  conn.logout();
	} else if (reason === DisconnectReason.restartRequired) {
	  console.log("Restart Required, Restarting...");
	  connect();
	} else if (reason === DisconnectReason.timedOut) {
	  console.log("Connection TimedOut, Reconnecting...");
	  connect();
	} else {
	  conn.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
	}
      }
    })
    conn.ev.on('messages.upsert', async chatUpdate => {
      require('./msg/message')(conn, chatUpdate)
    })
  }
  connect()
}

app.get("/", async(req, res) => {
  res.header('content-type', 'image/png')
  res.end(QR)
})

start()
