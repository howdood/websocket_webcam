const WebSocket = require('ws');
const fetch = require('node-fetch');
const ps = require("child_process");
const uuid = require("uuid");
var ip = require("ip");
function getIP() {
  var ipaddr = ip.address();
  console.log(ipaddr);
  //now post it to google apps
  const Url = 'PUT URL OF YOUR WEB APP IP SERVER DEPLOYMENT HERE';
  var data = {
    addr: ipaddr
  };
  var params = {
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    method: "POST"
  };
  fetch(Url,params)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(error => {
    console.log(error);
    getIP();
  });
}
//do it once, then set to recurr every 15 minutes
getIP();
setInterval(getIP,(15*60*1000));
//set up the ws servers
const signal = new WebSocket.Server({ port: 8880 }); //signal server
const camera1 = new WebSocket.Server({ port: 8882 }); //camera1
const camera2 = new WebSocket.Server({ port: 8884 }); //camera2
const camera3 = new WebSocket.Server({ port: 8886 }); //camera2
const camera4 = new WebSocket.Server({ port: 8888 }); //camera2

//we need to keep track of which clients in each sockers are the player
var player = "";
//function to broadcast to player on any socket
function broadcast(socket, data, isBinary) {
  socket.clients.forEach(function each(client) {
    if (player === client.id && client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: isBinary });
//      console.log(data);
//      console.log(typeof data);
    }
  });
}
//function to relay latency signals back from player to connected cameras
signal.on('connection', function connection(ws, req) {
  ws.id = uuid.v4();
  let match
  if ( match = req.url.match(/^\/player\/(.*)$/) ) {
    //add player to array of players
    if (player === "") {player=ws.id} else {ws.id = player}
    console.log("player joined " + ws.id);
  }
  ws.on('message', (data, isBinary) => {
    console.log("message received from " + ws.id);
    signal.clients.forEach(function each(client) {
      if (player !== client.id && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
//set up handling for camera sockets
camera1.on('connection', (ws, req) => {
  //setup the buffer check
//  setInterval(bufferCheck, 1000, ws);
  //give new contact an id
  ws.id = uuid.v4();
  //if it's a player, give it the unique player id
  let match;
  if ( match = req.url.match(/^\/player\/(.*)$/) ) {
    //add player to array of players
    if (player === "") {player=ws.id} else {ws.id = player}
    console.log("player joined " + ws.id);
  }
  // Ensure that no more than one camera connects, while allowing multiple players.
  let nonPlayers = 0;
  camera1.clients.forEach(client => {
  console.log(client.id);
    if (player === "" || client.id !== player) {
      nonPlayers++;
      console.log(nonPlayers);
    }
  });
  //if there is already a nonPlayer registered, reject the connection
  if ( !(match = req.url.match(/^\/player\/(.*)$/)) && nonPlayers > 1 ) {
    ws.terminate(); // No match, reject the connection.
    console.log("connection rejected");
    return;
  }
  //set up message handling
  ws.on('message', (msg, isBinary) => {
    broadcast(camera1, msg, isBinary);
  });
  ws.on('close', (e) => {
    //do nothing
  });
});
//camera2
camera2.on('connection', (ws, req) => {
  //give new contact an id
  ws.id = uuid.v4();
  //if it's a player, give it the unique player id
  let match;
  if ( match = req.url.match(/^\/player\/(.*)$/) ) {
    //add player to array of players
    if (player === "") {player=ws.id} else {ws.id = player}
    console.log("player joined " + ws.id);
  }
  // Ensure that no more than one camera connects, while allowing multiple players.
  let nonPlayers = 0;
  camera2.clients.forEach(client => {
  console.log(client.id);
    if (player === "" || client.id !== player) {
      nonPlayers++;
      console.log(nonPlayers);
    }
  });
  //if there is already a nonPlayer registered, reject the connection
  if ( !(match = req.url.match(/^\/player\/(.*)$/)) && nonPlayers > 1 ) {
    ws.terminate(); // No match, reject the connection.
    console.log("connection rejected");
    return;
  }
  //set up message handling
  ws.on('message', (msg, isBinary) => {
    broadcast(camera2, msg, isBinary);
  });
  ws.on('close', (e) => {
    //do nothing
  });
});
//camera3
camera3.on('connection', (ws, req) => {
  //give new contact an id
  ws.id = uuid.v4();
  //if it's a player, give it the unique player id
  let match;
  if ( match = req.url.match(/^\/player\/(.*)$/) ) {
    //add player to array of players
    if (player === "") {player=ws.id} else {ws.id = player}
    console.log("player joined " + ws.id);
  }
  // Ensure that no more than one camera connects, while allowing multiple players.
  let nonPlayers = 0;
  camera3.clients.forEach(client => {
  console.log(client.id);
    if (player === "" || client.id !== player) {
      nonPlayers++;
      console.log(nonPlayers);
    }
  });
  //if there is already a nonPlayer registered, reject the connection
  if ( !(match = req.url.match(/^\/player\/(.*)$/)) && nonPlayers > 1 ) {
    ws.terminate(); // No match, reject the connection.
    console.log("connection rejected");
    return;
  }
  //set up message handling
  ws.on('message', (msg, isBinary) => {
    broadcast(camera3, msg, isBinary);
  });
  ws.on('close', (e) => {
    //do nothing
  });
});
//camera4
camera4.on('connection', (ws, req) => {
  //give new contact an id
  ws.id = uuid.v4();
  //if it's a player, give it the unique player id
  let match;
  if ( match = req.url.match(/^\/player\/(.*)$/) ) {
    //add player to array of players
    if (player === "") {player=ws.id} else {ws.id = player}
    console.log("player joined " + ws.id);
  }
  // Ensure that no more than one camera connects, while allowing multiple players.
  let nonPlayers = 0;
  camera4.clients.forEach(client => {
  console.log(client.id);
    if (player === "" || client.id !== player) {
      nonPlayers++;
      console.log(nonPlayers);
    }
  });
  //if there is already a nonPlayer registered, reject the connection
  if ( !(match = req.url.match(/^\/player\/(.*)$/)) && nonPlayers > 1 ) {
    ws.terminate(); // No match, reject the connection.
    console.log("connection rejected");
    return;
  }
  //set up message handling
  ws.on('message', (msg, isBinary) => {
    broadcast(camera4, msg, isBinary);
  });
  ws.on('close', (e) => {
    //do nothing
  });
});

//function to deal with buffer overruns at server side
function bufferCheck(socket) {
  console.log(socket.bufferedAmount);
}
