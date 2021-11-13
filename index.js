let Baileys = require('@adiwajshing/baileys')
let fs = require('fs')
let msgMain = require('./msg/message')
let CFonts = require('cfonts')
let figlet = require('figlet')
let { color } = require('./lib/color')
let package = JSON.parse(fs.readFileSync('./package.json'))

async function start() {
  console.log(color(figlet.textSync(`Cxd9Bot`, 'Larry 3D'), 'cyan'))
  CFonts.say(`Created By : ${package.author} Team!`, {
    font: 'console',
    align: "center",
    gradient: ['yellow', 'yellow']
  })
  let WAC = new Baileys.WAConnection()
  WAC.autoReconnect = Baileys.ReconnectMode.onConnectionLost
  WAC.version = [2, 2140, 6]
  WAC.logger.level = 'warn'
  WAC.on('qr', () => {
    console.log(color('[SYSTEM] Scan The QR Code!', 'yellow'))
  })
  fs.existsSync('./sessions.json') && WAC.loadAuthInfo('./sessions.json')
  await WAC.connect({timeoutMs: 30*1000})
  console.log(color('[BOT] Connected!', 'green'))
  WAC.on('chats-received', async ({ hasNewChats }) => {
    console.log(color(`[SYSTEM] You have ${WAC.chats.length} chats, new chats available: ${hasNewChats}`, 'magenta'))
  })
  WAC.on('contacts-received', () => {
    console.log(color('[SYSTEM] You have ' + Object.keys(WAC.contacts).length + ' contacts', 'brown'))
  })
  WAC.on('chat-update', async (message) => {
    msgMain(conn, message)
  })
}

start()
