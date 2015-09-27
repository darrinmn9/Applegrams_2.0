var SocketModel = Backbone.Model.extend({


  initialize: function() {
    var context = this;


    context.userId = undefined;
    var acceptConnection = function(userId) {
      if (userId && userId < 11) {
        return true;
      }
      return false;
    };

    // var socket = io.connect('https://applegrams2.herokuapp.com/');
    var socket = io.connect('http://localhost:3000');

    this.peeling = function() {
      socket.emit('peeling');
    };

    this.splitting = function(pieceToRemove) {
      socket.emit('splitting', pieceToRemove);
    };

    this.updateTableInfo = function(userObj) {
      socket.emit('updateTableInfo', userObj);
    };

    this.startGame = function() {
      socket.emit('startGame');
    };

    this.sendWinningBoard = function(board, userId) {
      console.log('client sent winning board', userId);
      socket.emit('winningBoard', {
        board: board,
        userId: userId
      });
    };



    //array containing starting pieces
    socket.on('joined', function(startingBoard) {
      if (acceptConnection(context.userId)) {
        // context.startingPieces = startingBoard;
        context.trigger('joined', startingBoard);
        //trigger show board event
      }
    });

    //stores unique player ID, used for retrieving peel
    socket.on('userId', function(data) {
      context.userId = data;
      if (data < 11) {
        context.trigger('userId', data);
        if (data === 1) {
          context.trigger('host');
        } else {
          context.trigger('player');
        }
      }
    });

    socket.on('startGame', function() {
      if (acceptConnection(context.userId)) {
        //when hosts clicks start button, other players will get this event trigger
        context.trigger('startGame');
      }
    });

    socket.on('peeled', function(piecesArray) {
      if (acceptConnection(context.userId)) {
        context.trigger('peel', piecesArray);
      }
    });

    socket.on('split', function(piecesToAdd) {
      if (acceptConnection(context.userId)) {
        context.trigger('split', piecesToAdd);
      }
    });

    socket.on('dashboardUpdate', function(data, lettersLeft) {
      if (acceptConnection(context.userId)) {
        context.trigger('updateTableInfo', data, lettersLeft);
      }
    });

    socket.on('another player has joined', function() {
      if (acceptConnection(context.userId)) {
        context.trigger('playerJoined');
      }
    });

    socket.on('peelToWin', function() {
      if (acceptConnection(context.userId)) {
        //display "Next peel wins!!!"
        context.trigger('peelToWin');
        console.log('socket p2win');
      }
    });

    socket.on('Win', function() {
      if (acceptConnection(context.userId)) {
        context.trigger('win');
        console.log('you win');
      }
    });

    socket.on('Lose', function(winner) {
      if (acceptConnection(context.userId)) {
        context.trigger('lose', winner.board, winner.username);
        console.log('you lose');
      }
    });


    socket.on('player disconnected', function() {
      if (acceptConnection(context.userId)) {
        console.log('other player disconnected');
        context.trigger('playerDisconnected');
      }
    });
  }

});
