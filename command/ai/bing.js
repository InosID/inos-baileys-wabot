// const { bing } = require('gpti');

// module.exports = {
//   name: "bing",
//   alias: ['bingchat', 'bingc', 'bchat'],
//   category: "ai",
//   use: "<query>",
//   example: "%cmd (your prompt here)",
//   isQuery: true,
//   isSpam: true,
//   async run({ conn, msg }, { query, args }) {
//     // Check if query is provided
//     if (args.length < 1) {
//       return await send(chat.minWord, msg.key);
//     }

//     // Initialize variables
//     let stream = setting.stream.bingchat || false;
//     let messages = user[msg.sender]?.bingchatmessage || [];

//     // Clear messages if more than 20
//     if (messages.length > 20) {
//       user[msg.sender].bingchatmessage = [];
//     }

//     // Add user message to the array
//     let MessageContent = [
//       ...messages,
//       {
//         role: "user",
//         content: query
//       }
//     ];

//     // Get and process chat history using bingChat function
//     let bchat = await bingChat(MessageContent, stream);

//     // Process and send messages
//     const regex = /\[\^(\d+)\^\]\((https:\/\/[^\)]+)\)/g;

//     if (stream) {
//       let sended = await msg.reply(bchat[0].message);
//       try {
//         for (let i = 0; i < bchat.length; i++) {
//           if (bchat[i].message) {
//             let modifiedMessage = bchat[i].message.replace(regex, '\n- $2\n');
//             await conn.sendMessage(msg.from, { text: modifiedMessage, edit: sended.key });
//           }
//         }
//         MessageContent = [
//           ...MessageContent,
//           {
//             role: "assistant",
//             content: bchat[bchat.length - 2].message
//           }
//         ];
//         user[msg.sender].bingchatmessage = [...MessageContent];
//         db.save('user', user);
//       } catch (err) {
//         console.log(err);
//       }
//     } else {
//       msg.reply(bchat.message.replace(regex, '\n- $2\n'));
//       MessageContent = [
//         ...MessageContent,
//         { role: "assistant", content: bchat.message }
//       ];
//       user[msg.sender].bingchatmessage = MessageContent;
//       db.save('user', user);
//     }
//   },
// };

// // Simplified bingChat function with comments
// async function bingChat(messages = [], stream = false) {
//   return new Promise((resolve, reject) => {
//     const outputArray = [];
//     const uniqueValues = new Set();

//     const handleResponse = (err, data) => {
//       if (err) {
//         console.log(err);
//       } else {
//         if (stream) {
//           outputArray.push(data);

//           if (data.finish) {
//             let filteredArray = outputArray.filter(obj => {
//               const value = obj.message;
//               if (!uniqueValues.has(value)) {
//                 uniqueValues.add(value);
//                 return true;
//               }
//               return false;
//             });
//             resolve(filteredArray);
//           }
//         } else {
//           resolve(data);
//         }
//       }
//     };

//     bing({
//       messages,
//       conversation_style: "Balanced",
//       markdown: false,
//       stream,
//     }, handleResponse);
//   });
// }
