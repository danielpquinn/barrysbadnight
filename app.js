var _ = require('underscore'),
  express = require('express.io'),
  app = express().http().io(),
  players = [],
  projectiles = [];

app.use(express.static(__dirname + '/static'));

app.io.sockets.on('connection', function (socket) {
  var ua = socket.handshake.headers['user-agent'];

  if (!/mobile/i.test(ua)) {
    socket.emit('connection data', {
      players: players
    });
    return;
  }

  console.log(socket.id + ' connected');

  players.push({
    id: socket.id
  });

  console.log(players);

  app.io.broadcast('player connected', {
    id: socket.id
  });

  socket.on('key pressed', function (data) {
    app.io.broadcast('key pressed', { id: socket.id, keyCode: data.keyCode });
  });

  socket.on('key released', function (data) {
    app.io.broadcast('key released', { id: socket.id, keyCode: data.keyCode });
  });

  socket.on('projectile fired', function (data) {
    app.io.broadcast('projectile fired', {
      id: socket.id,
      vX: data.vX,
      vY: data.vY
    });
    console.log(data.vX);
    console.log(data.vY);
  });

  socket.on('disconnect', function () {
    console.log(socket.id + ' disconnected');
    players = _.without(players, _.findWhere(players, {id: socket.id}));
    app.io.broadcast('player disconnected', {
      id: socket.id
    });
  });
});

// Send the client html.
app.get('/', function(req, res) {
  var ua = req.header('user-agent');

  if (/mobile/i.test(ua)) {
    res.sendfile(__dirname + '/static/mobile.html');
  } else {
    res.sendfile(__dirname + '/static/desktop.html');
  }
});

app.listen(7076);