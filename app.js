var _ = require('underscore');
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Applegrams server is listening on port: ', port);
});
var socket_io = require('socket.io');
var io = socket_io.listen(server);

//server files in /public folder
app.use(express.static(__dirname + '/public'));

var letterPool = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'D', 'D', 'D', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'F', 'F', 'F', 'G', 'G', 'G', 'G', 'H', 'H', 'H', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'J', 'J', 'K', 'K', 'L', 'L', 'L', 'L', 'L', 'M', 'M', 'M', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'P', 'P', 'P', 'Q', 'Q', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'S', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'U', 'U', 'U', 'U', 'U', 'U', 'V', 'V', 'V', 'W', 'W', 'W', 'X', 'X', 'Y', 'Y', 'Y', 'Z', 'Z']
letterPool = _.shuffle(letterPool);
var newGameCopy = letterPool.slice();
var usernames = {};
var playerCount = 0;
var lastPeel = false;
var startUpdates = true;
var maxPlayers = 10;


function removePieces(pool, number) {
  //removes # of starting pieces from pool
  var result = [];
  for (var i = 0; i < number; i++) {
    result.push(peel(pool));
  }
  return result;
}

function peel(pool) {
  //removes one piece randomly from the pool
  return pool.pop();
}

function split(pool, addedPiece) {
  //adds 1 piece, removes (and returns) 3 pieces randomly from the pool
  var result = removePieces(pool, 3);
  pool.splice(_.random(0, pool.length - 1), 0, addedPiece);
  return result;
}

function peelToWin(pool, players) {
  return pool.length < players ? true : false;
}

io.on('connection', function(socket) {
  console.log('player connected');
  playerCount++;
  var addUser = true;

  if (startUpdates && playerCount > 1) {
    startUpdates = false;
    var timer = setInterval(function() {
      io.emit('dashboardUpdate', usernames, letterPool.length)
    }, 3000);
  }

  //send each user a unique identifier
  socket.emit('userId', playerCount);

  //once a user connects, send them 7 starting pieces
  socket.emit('joined', removePieces(letterPool, 7));
  console.log(letterPool.length);

  socket.on('startGame', function() {
    socket.broadcast.emit('startGame');
  })

  //broadcast event to other players
  socket.broadcast.emit('another player has joined');

  socket.on('peeling', function() {
    console.log('peeling');

    //will end the game if peeling event is emitting when pieces < players
    if (lastPeel) {
      socket.emit('Win');

    } else {

      /*send all users 1 piece. I'm not sure if socket IO allows you to emit a unique message to all users, so
		  as a workaround, I send an array of length = players, each player will grab a specific piece of the array
		  based on the unique identifier given upon original connection
		  */

      io.emit('peeled', removePieces(letterPool, Math.min(playerCount, maxPlayers)));

      // if there are more players than pieces left, alert everyone of last peel!
      if (peelToWin(letterPool, Math.min(playerCount, maxPlayers))) {
        lastPeel = true;
        io.emit('peelToWin', 'Next Peel Wins!!!');
      }
    }

  });

  socket.on('splitting', function(incomingPiece) {
    console.log('player splitting');

    //send user 3 pieces and add back original piece to letter pool
    socket.emit('split', split(letterPool, incomingPiece));

    //if splitting caused pieces > players, reset lastPeel to false
    if (peelToWin(letterPool, Math.min(playerCount, maxPlayers))) {
      lastPeel = true;
    }
  });

  socket.on('updateTableInfo', function(userObj) {
    if (userObj !== null) {
      usernames[userObj.userId] = userObj;
    }

  });

  socket.on('winningBoard', function(winner) {
    socket.broadcast.emit('Lose', {
      board: winner.board,
      username: usernames[winner.userId]['username']
    });

  });


  socket.on('disconnect', function() {
    console.log('player disconnected');

    //not sure how to handle if someone leaves the game, should this affect peelToWin?
    if (addUser) {
      playerCount--;

      //need to fix

    }


    socket.broadcast.emit('player disconnected');
    if (playerCount < 2) {
      console.log('less than 2 players ********')
      letterPool = newGameCopy.slice();
      usernames = {};
      lastPeel = false;
      startUpdates = true;
      playerCount = 0;
      clearInterval(timer);

    }
  });

});
