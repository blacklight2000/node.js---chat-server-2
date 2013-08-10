var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
//require('socket.io').listen(app, { log: false }); <-- that's for completely removing socket.io debugging
io.set('log level', 1); // reduce logging
var screenNames = []

server.listen(8080)

app.get('/', function(req, res) {
  res.sendfile(__dirname+'/index.html')
 })


io.sockets.on('connection', function(socket) {
  console.log("Connection...")
  socket.on('new user', function(data, callback) {
    if(screenNames.indexOf(data) != -1) {
      callback(false)
      } else {
         callback(true)
         socket.screenName = data
         screenNames.push(socket.screenName)
         updatescreenNames()
         }
  })
  function updatescreenNames() {
    io.sockets.emit('usernames',screenNames)
  }

  socket.on('send message', function(data) { 
    io.sockets.emit('new message', { msg: data, screenName: socket.screenName }) 
    console.log(data) 
  })
 
  socket.on('disconnect', function(data) {
    if(!socket.screenName) return
    screenNames.splice(screenNames.indexOf(socket.screenName),1)
    updatescreenNames()
    })
 
  })
