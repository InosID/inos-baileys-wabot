let { WAConnection, ReconnectMode } = require('@adiwajshing/baileys')
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
  let conn = new WAConnection()
  conn.autoReconnect = ReconnectMode.onConnectionLost
  conn.version = [2, 2140, 6]
  conn.logger.level = 'warn'
  conn.on('qr', () => {
    console.log('')
  })
  msgMain()
}

start()
