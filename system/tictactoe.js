module.exports = async (msg, conn) => {
  // Extract relevant information from the message
  const { from, sender, body } = msg;
  const text = body

  // Set debug mode (false by default)
  const debugMode = false;

  // Initialize variables for game state
  let ok;
  let isWin = false;
  let isTie = false;
  let isSurrender = false;

  // Initialize Tic Tac Toe game in the connection object if not already exists
  conn.ttt = conn.ttt ? conn.ttt : {};

  // Find the active game room
  let room = Object.values(conn.ttt).find(room =>
    room.id && room.game && room.state &&
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender) &&
    room.state === 'PLAYING'
  );

  // Check if there is an active game room
  if (room) {
    // Handle surrender command or invalid input
    if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(text)) return true;
    isSurrender = !/^[1-9]$/.test(text);

    // Check if it's the correct player's turn
    if (sender !== room.game.currentTurn) {
      if (!isSurrender) return true;
    }

    // Debug mode logging
    if (debugMode) msg.reply('[DEBUG]\n' + require('util').format({ isSurrender, text: text }));

    // Handle player move and check for game end conditions
    if (!isSurrender && (ok = room.game.turn(sender === room.game.playerO, parseInt(text) - 1)) < 1) {
      msg.reply(chat.command.tictactoe.condition[ok.toString()]);
      return true;
    }

    // Check if there is a winner or tie
    if (sender === room.game.winner) isWin = true;
    else if (room.game.board === 511) isTie = true;

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

    // Handle surrender case and determine winner
    if (isSurrender) {
      room.game._currentTurn = sender === room.game.playerX;
      isWin = true;
    }

    // Determine the winner and construct the game board message
    let winner = isSurrender ? room.game.currentTurn : room.game.winner;
    let final = isWin ? 'win' : isTie ? 'draw' : 'turn';
    let currentPlayerSymbol = ['❌', '⭕'][1 * room.game._currentTurn];
    let str = chat.command.tictactoe.final[final]
      .replace(':winner:', winner ? winner.split('@')[0] : '')
      .replace(':psymbol:', currentPlayerSymbol ? currentPlayerSymbol : '')
      .replace(':turn:', room.game.currentTurn ? room.game.currentTurn.split('@')[0] : '')
      .replace(':board1:', arr.slice(0, 3).join(''))
      .replace(':board2:', arr.slice(3, 6).join(''))
      .replace(':board3:', arr.slice(6).join(''));

    // Update player's move and send the board to both players
    if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== from)
      room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = from;

    if (room.x !== room.o) await msg.reply(str, { withTag: true }, room.x);
    await msg.reply(str, { withTag: true }, room.o);

    // Cleanup: delete the room if the game is over
    if (isTie || isWin) {
      if (debugMode) msg.reply('[DEBUG]\n' + require('util').format(room));
      delete conn.ttt[room.id];
    }
  }

  return true;
};
