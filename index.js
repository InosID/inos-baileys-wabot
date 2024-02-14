// Import necessary modules and functions from external libraries
const {
  default: Baileys,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');

// const express = require('express');
const Pino = require('pino');
const { Boom } = require('@hapi/boom');
const { readFeatures } = require('./lib');
const express = require('express');

const app = new express();
let PORT = 3000

app.get('/', function (req, res) {
  res.send('online');
});

// Initialize attributes object
const attr = {
  uptime: new Date(),
  command: new Map()
};

// Create an in-memory store with Pino logger
let store = makeInMemoryStore({
  logger: Pino().child({
    level: 'silent',
    stream: 'store'
  })
});

// Read features from the 'lib' module
readFeatures(attr);

// Define the 'start' asynchronous function
async function start() {
  try {
    // Fetch the latest Baileys version and use multi-file auth state
    let { version } = await fetchLatestBaileysVersion();
    let { state, saveCreds } = await useMultiFileAuthState('./session');

    // Create a Baileys connection with specified configurations
    const conn = Baileys({
      auth: state,
      logger: Pino({ level: "silent" }),
      version,
      printQRInTerminal: true,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 10000,
      linkPreviewImageThumbnailWidth: 300,
      generateHighQualityLinkPreview: true,
      patchMessageBeforeSending: (message) => {
        // Patch messages before sending if required
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
        if (requiresPatch) {
          message = {
            viewOnceMessage: {
              message: {
                messageContextInfo: {
                  deviceListMetadataVersion: 2,
                  deviceListMetadata: {},
                },
                ...message,
              },
            },
          };
        }
        return message;
      },
      getMessage: async (key) => {
        // Get message from the store or return a default message
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg.message || undefined;
        }
        return {
          conversation: "hello world",
        };
      },
    });

    // Bind store to the connection events
    store.bind(conn.ev);

    // Listen for 'creds.update' event and save credentials
    conn.ev.on("creds.update", saveCreds);

    // Listen for 'connection.update' event and handle connection updates
    conn.ev.on("connection.update", async (update) => {
      const { lastDisconnect, connection } = update;
    
      // Log connection status
      if (connection) {
        console.log(connection === "connecting" ? "Connecting to the WhatsApp bot..." : `Connection: ${connection}`);
      }
    
      // Handle different connection states
      switch (connection) {
        case "open":
          console.log("Successfully connected to WhatsApp");
          break;
        case "close":
          handleDisconnect(lastDisconnect.error);
          break;
      }
    });
    
    // Function to handle disconnect reasons
    function handleDisconnect(error) {
      const reason = new Boom(error).output.statusCode;
    
      // Handle specific disconnect reasons
      switch (reason) {
        case DisconnectReason.badSession:
          console.log("Bad Session File, Please Delete session and Scan Again");
          conn.logout();
          break;
        case DisconnectReason.connectionClosed:
          console.log("Connection closed, reconnecting...");
          start();
          break;
        case DisconnectReason.connectionLost:
          console.log("Connection Lost from Server, reconnecting...");
          start();
          break;
        case DisconnectReason.connectionReplaced:
          console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
          conn.logout();
          break;
        case DisconnectReason.loggedOut:
          console.log("Device Logged Out, Please Delete session and Scan Again.");
          conn.logout();
          break;
        case DisconnectReason.restartRequired:
          console.log("Restart Required, Restarting...");
          start();
          break;
        case DisconnectReason.timedOut:
          console.log("Connection TimedOut, Reconnecting...");
          start();
          break;
        default:
          conn.end(`Unknown DisconnectReason: ${reason}|${error}`);
      }
    }

    conn.ev.on("group-participants.update", async (msg) => {
      require("./system/welcome")(conn, msg);
    });
    
    // Listen for 'messages.upsert' event and call the handler function
    conn.ev.on("messages.upsert", async (message) => {
      require('./handler')(message, conn, attr);
    });
  } catch (error) {
    console.error(error);
  }
}

// Start the application by calling the 'start' function
start();

// app.listen(PORT, () => {
//   console.log('App listened on port:', PORT)
// })
