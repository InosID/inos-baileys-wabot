let Baileys = require('@adiwajshing/baileys')
let conn = new Baileys.WAConnection()
let fs = require('fs')
let CFonts = require('cfonts')
let figlet = require('figlet')
let { color } = require('./lib/color')
let package = JSON.parse(fs.readFileSync('./package.json'))
let express = require('express')
let app = new express()
let request = require('request')

/*id_session = String
let qr_sess = {}
let session_connect = []
let session_status = {}
let session_pending = []*/

app.get('/', (req, res) => res.status(200).send('Cxd Client'))
let PORT = process.env.PORT || 8080 || 5000 || 3000
app.listen(PORT, () => {
  console.log(color('Localhost is running!', 'yellow'))
})

async function start() {
  console.log(color(figlet.textSync(`Cxd9Bot`, 'Larry 3D'), 'cyan'))
  CFonts.say(`Created By : ${package.author} Team!`, {
    font: 'console',
    align: "center",
    gradient: ['yellow', 'yellow']
  })
  conn.autoReconnect = Baileys.ReconnectMode.onConnectionLost
  conn.version = [2, 2140, 6]
  conn.logger.level = 'warn'
  conn.connectOptions.logQR = false
  conn.on('qr', () => {
    console.log(color("[SYSTEM]", "green"), "Scan the QR code!")
  })
  fs.existsSync('./sessions.json') && conn.loadAuthInfo('./sessions.json')
  await conn.connect({timeoutMs: 30*1000})
  console.log(color('[BOT] Connected!', 'green'))
  conn.on('chats-received', async ({ hasNewChats }) => {
    console.log(color(`[SYSTEM] You have ${conn.chats.length} chats, new chats available: ${hasNewChats}`, 'magenta'))
  })
  conn.on('contacts-received', () => {
    console.log(color('[SYSTEM] You have ' + Object.keys(conn.contacts).length + ' contacts', 'brown'))
  })
}
/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) { 
  console.log("‣ Module", `'${module}'`, "is now being watched for changes"); 
  fs.watchFile(require.resolve(module), async () => { 
    await uncache(require.resolve(module)); 
    cb(module); 
  }); 
}

/**
 * Uncache a module
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
  });
}

start()

require('./msg/message.js')
nocache('./msg/message.js', module => console.log(color(`message.js is now updated!`)))

conn.on('chat-update', async (message) => {
  require('./msg/message.js')(conn, message)
})
