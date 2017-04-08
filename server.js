'use strict';

var app = require('express')();

app.post('/sms', function(req, res) {
  var twilio = require('twilio');
  var twiml = new twilio.TwimlResponse();
  twiml.message('The Robots are coming! Head for the hills!');
  res.writeHead(200, {'Content-Type': 'text/xml'});
  console.log("response recieved");
  res.end(twiml.toString());
});
var http = require('http').Server(app);
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

// mongolabs (to look at database)
// username: cmpsc431wTeam2
// password: password314



// Twilio Credentials 
var accountSid = 'AC781a0833a4249069bcf3ae072619d368'; 
var authToken = 'ff1c34b4d97f8aae459ffb4dcb62efba'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
    to: "+18149698492", 
    from: "+18148063881", 
    body: "twilio test", 
}, function(err, message) { 
    console.log(message.sid); 
});





// 1
var io = require('socket.io')(http);


// we wont need this anymore because we are using mySQL not mongoDB
////////////////////////////////////  
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin1:@ds137110.mlab.com:37110/himalaya');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
    console.log('Database connected.');
});
////////////////////////////////////



app.get('/', function (req, res) {
  res.sendFile(__dirname+ '/index.html');
  console.log('someone loaded homepage');
});
app.get('/js/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});
app.get('/css/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});

app.get('/images/*', function (req, res) {
  res.sendFile(__dirname+ req.path);
});
// app.get('/images/still/*', function (req, res) {
//   res.sendFile(__dirname+ req.path);
// });



var item = require('./models/item.js');


io.on('connection', function(socket) {
  //clients.push(socket.id);   //not necessary but useful for storing users and sending messages to them
  //io.sockets.connected[socket.id].emit("message-history", messageHistoryObject.getMessages());

/*
var messageSchema = mongoose.Schema({
  name: String,
  message: String,
  dateSent: { type: Date, default: Date.now }
});

var messages = mongoose.model('message', messageSchema);
*/ 
  //var thePost = require('./models/message.js');
  //mongoose.model('post', thePost);
  //var posts = db.model('post');
  //var posts = mongoose.model('posts', thePost);

  //posts.find({}, [], function(err, calls) { 
    //console.log(err, calls, calls.length);  //prints out: null [] 0
  //});
  socket.on('disconnect', function() {
    console.log('someone left');
  });
  socket.on('get items', function() {
    
    item.find({} ,function (err, doc){
        if(err){
          console.log("error");
        }
        else{
          io.emit('item list', doc);
        }
        
    });
  });

  socket.on('button clicked', function(msg) {

    io.emit('button was clicked', msg);
//
// itemID: String,
//  description: String,
//  URL: String,
//  name: String,
//     numberOfRatings: number,
//  rating: number,
//  dateAdded:
   




      
      var a = new item({
          itemID: msg.itemID,
          description: msg.description,
          URL: msg.URL,
          name: msg.name,
          numberOfRatings: msg.numberOfRatings,
          categoryID: msg.categoryID,
          rating: msg.rating
          
      })
      console.log(a);

      a.save(function(error){
        // if (error){
        //     console.log('item was successfully added');
        //   }
        //   else{
        //     console.log('item add failed');
        //   }
      })
  });
});




var server = http.listen(app.get('port') , function () {
    console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});





//javascript class example
/*
function player(xStart, yStart, socketId){
  
  if(xStart){
   this.x=xStart;
  }
  else{
    this.x=width/2;
  }
  if(yStart){
    this.y=yStart;  
  }
  else{
    this.y=height/2;
  }
  this.xOld=this.x;
  this.color= getRandomColor();
  this.socketId=socketId;//guid();
  this.speed=1;

  this.yOld=this.y;
  this.keys=[];
}

player.prototype.update = function(){
  // w = 38
  // a = 65
  // s = 83
  // d = 68
  if('87' in this.keys){  //w up
      this.y-=this.speed;
  }
  if('83' in this.keys){  //s down
      this.y+=this.speed;
  }
  if('65' in this.keys){  //a left
      this.x-=this.speed;
  }
  if('68' in this.keys){  //d right
      this.x+=this.speed;
  }

  // if(this.keys.length>0){
  //   io.emit('player position', this);
  // }
}

function playerList(){
  this.players=new Array;
}
playerList.prototype.add = function(socketId){
  this.players.push(new player(200,200, socketId));
}

playerList.prototype.removeBySocketId = function(socketId){
  for(var i = 0; i<this.players.length;i++){

    if (this.players[i].socketId==socketId){
      this.players.splice(i,1);
      break
    }
  }
}

playerList.prototype.changeKeysBySocketId = function(socketId, keys){
  for(var i = 0; i<this.players.length;i++){
    if (this.players[i].socketId==socketId){
      this.players[i].keys=keys;
    }
  }
}

playerList.prototype.update = function(){
  for(var i = 0; i<this.players.length;i++){
    this.players[i].update();
  }
}
var players= new playerList();
*/