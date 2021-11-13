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
  let conn = new Baileys.WAConnection()
  conn.autoReconnect = Baileys.ReconnectMode.onConnectionLost
  conn.version = [2, 2140, 6]
  conn.logger.level = 'warn'
  conn.on('qr', () => {
    console.log(color('[SYSTEM] Scan The QR Code!', 'yellow'))
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
  conn.on('chat-update', async (message) => {
    msgMain(message)
  })
}

start()
