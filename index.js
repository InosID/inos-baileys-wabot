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

app.get('/', (req, res) => res.status(200).send('CXD Client'))
let PORT = process.env.PORT || 8080 || 5000 || 3000
app.listen(PORT, () => {
  console.log(color('Localhost is running!', 'yellow'))
})
app.get('/favicon.ico',async(req,res)=>{
  buff = fs.readFileSync('./views/favicon.png')
  res.end(buff,'binary')
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
  qrScan = true
  client.on('qr', async (buff) => {
    let buf = await qrcode.toDataURL(buff, { scale: 10 })
    buf = await buf.replace('data:image/png;base64,', "")
    buf = await new Buffer.from(buf, "base64")
    qr_sess[id_session] = await buf
    session_status[id_session] = await "waiting scan qr"
    if (qrScan) {
      qrScan = false;
      setTimeout(function() {
        if (!isConnected) {
	  conn.close()
	  session_pending.splice(session_pending.lastIndexOf(id_session), 1)
	  delete qr_sess[id_session]
	  console.log('system time out')
	}
      }, 27*1000)
    }
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
      delete require.cache[require.resolve(module)];
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

require('./msg/message.js');
nocache('./msg/message.js', module => console.log(color(`message.js is now updated!`)));

conn.on('chat-update', async (message) => {
  require('./msg/message.js')(conn, message);
})

start()
