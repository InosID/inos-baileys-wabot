// Masih otak atik
let { makeWASocket } = require('@adiwajshing/baileys-md')

async function start() {
  let conn = makeWASocket({
    printQRInTerminal: true
  })
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if(connection === 'close') {
      const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
      if(shouldReconnect) {
        sock = startSock()
      }
    } else if(connection === 'open') {
      console.log('opened connection')
    }
  })
  sock.ev.on('messages.upsert', m => {
    console.log(JSON.stringify(m, undefined, 2))

    console.log('replying to', m.messages[0].key.remoteJid)
    sendMessageWTyping({ text: 'Hello there!' }, m.messages[0].key.remoteJid!)
  })
}
