let { readFileSync: read } = require('fs')

exports.tekateki = JSON.parse(read('./msg/command/game/database/tekateki.json'))
