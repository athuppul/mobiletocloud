exports.init = function(io) {
	var currentPlayers = 0; // keep track of the number of players

  // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		++currentPlayers;

		socket.on('chat message', function(msg){
    	console.log('message: ' + msg);
			io.emit('chat message', msg);
  	});

		socket.on('disconnect', function () {
			--currentPlayers;
			socket.broadcast.emit('players', { number: currentPlayers});
		});
	});
}
