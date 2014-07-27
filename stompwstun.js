//STOMP WEBSOCKET TUNNEL
//filename: stompwstun.js
//Author: igorfritzsch, July 2014
//This Script provides a WebSocket connection to STOMP
//It creates a tunnel to connect to RabbitMQ STOMP plugin 
//via Socket connection on Port 61613

//ONLY UTF8 DATA FORMAT SUPPORTED

var wssrv = require('websocket').server,
    http = require('http'),
    net = require('net');
	
var connections = [];

var server = http.createServer(function(req, res) {
  console.log((new Date()) + ' Received request for ' + req.url);
  res.writeHead(404);
  res.end();
}).listen(8182);

var wss = new wssrv({
  httpServer: server,
  autoAcceptConnections: false
});

wss.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  console.log((new Date()) + ' Connection accepted.');
  
  // Socket connection to RabbitMQ STOMP Plugin //
  var client = net.connect({port: 61613}, function(){
    console.log('Connection to STOMP plugin established.')
  });

  client.setEncoding('utf8');

  client.on('data', function(data){
	connection.send(data);
  });
  // Socket connection to RabbitMQ STOMP Plugin //
  
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
	  client.write(message.utf8Data);
    }
  });

});
