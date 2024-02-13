const { TicTacToe } = require("../../lib");

module.exports = {
  name: "tictactoe",
  alias: ["ttt"],
  category: "group",
  desc: "Tic Tac Toe game",
  use: '[query]',
  isSpam: true,
  isGroup: true,
  async run({ msg, conn }, { query }) {
    // Extract query parameter
    let text = query;

    // Initialize ttt object in the connection if not already exists
    conn.ttt = conn.ttt ? conn.ttt : {};

    // Check if the player is already in a Tic Tac Toe game
    if (Object.values(conn.ttt).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(msg.sender))) {
      return msg.reply(chat.command.tictactoe.ingame);
    }

    // Find a waiting room or create a new one
    let room = Object.values(conn.ttt).find(room => room.state === 'WAITING' && (text ? room.name === text : true));

    if (room) {
      // Player found a waiting room, join the game
      room.o = msg.from;
      room.game.playerO = msg.sender;
      room.state = 'PLAYING';

      // Map the Tic Tac Toe board to emojis
      let arr = room.game.render().map(v => {
        return {
          X: '❌',
          O: '⭕',
          1: '1️⃣',
          2: '2️⃣',
          3: '3️⃣',
          4: '4️⃣',
          5: '5️⃣',
          6: '6️⃣',
          7: '7️⃣',
          8: '8️⃣',
          9: '9️⃣',
        }[v];
      });

      // Construct the message with the board
      let str = chat.command.tictactoe.board
        .replace(':turn:', room.game.currentTurn.split('@')[0])
        .replace(':board1:', arr.slice(0, 3).join(' '))
        .replace(':board2:', arr.slice(3, 6).join(' '))
        .replace(':board3:', arr.slice(6).join(' '))

      // Send the board to both players
      if (room.x !== room.o) await msg.reply(str, { withTag: true }, room.x);
      await msg.reply(str, { withTag: true }, room.o);
    } else {
      // No waiting room found, create a new room
      room = {
        id: 'tictactoe-' + (+new Date),
        x: msg.from,
        o: '',
        game: new TicTacToe(msg.sender, 'o'),
        state: 'WAITING',
      };

      if (text) room.name = text;

      // Notify the player about the waiting room
      msg.reply(
        chat.command.tictactoe.waiting
          .replace(':roomname1:', text ? ` in the room "${text}"` : '')
          .replace(':roomname2:', text ? text : '')
      )
      
      // Store the room in the connection object
      conn.ttt[room.id] = room;
    }
  },
};
