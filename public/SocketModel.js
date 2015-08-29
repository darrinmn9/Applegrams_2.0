var SocketModel = Backbone.Model.extend({


  initialize: function() {
    var context = this;

    // var socket = io.connect('https://rocky-plateau-5853.herokuapp.com/');
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

    //array containing starting pieces
    socket.on('joined', function(startingBoard) {
      // context.startingPieces = startingBoard;
      context.trigger('joined', startingBoard);
      //trigger show board event
    });

    //stores unique player ID, used for retrieving peel
    socket.on('userId', function(data) {
      // context.userId = data;
      context.trigger('userId', data);
      if (data === 1) {
        context.trigger('host');
      } else {
        context.trigger('player');
      }
    });

    socket.on('startGame', function() {
      //when hosts clicks start button, other players will get this event trigger
      context.trigger('startGame');
    });

    socket.on('peeled', function(piecesArray) {

      context.trigger('peel', piecesArray);
    });

    socket.on('split', function(piecesToAdd) {
      context.trigger('split', piecesToAdd);
    });

    socket.on('dashboardUpdate', function(data, lettersLeft) {
      console.log(data)
      context.trigger('updateTableInfo', data, lettersLeft);
    });

    socket.on('another player has joined', function() {
      context.trigger('playerJoined');
    });

    socket.on('peelToWin', function() {
      //display "Next peel wins!!!"
      context.trigger('peelToWin');
    });

    socket.on('You Win', function() {
      context.trigger('win');
      console.log('you win')
    });

    socket.on('You Lose', function(winningBoard) {
      context.trigger('lose', winningBoard);
      console.log('you lose')

    });


    socket.on('player disconnected', function() {
      console.log('other player disconnected');
      context.trigger('playerDisconnected');
    });
  }

});
