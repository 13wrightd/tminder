  'use strict';

  var app = require('express')();

  // app.post('/sms', function(req, res) {
  //   var twilio = require('twilio');
  //   var twiml = new twilio.TwimlResponse();
  //   twiml.message('reminder has been scheduled');
  //   res.writeHead(200, {'Content-Type': 'text/xml'});
  //   console.log(req.body.Body);
  //   res.end(twiml.toString());
  // });

  var bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({extended: false}));

  var http = require('http').Server(app);
  app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
  //app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");


  // mongolabs (to look at database)
  // username: cmpsc431wTeam2
  // password: password314

  var reminder = require('./models/reminder.js');



  var chrono = require('chrono-node')

  //url.substring( url.indexOf('?') + 1 );



  app.post('/sms', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();


    var string=req.body.Body;

    var results = chrono.parse(string);
    var dateNeeded=  results[0].start.date();
    console.log(string+' dateneeded: '+ dateNeeded);
    var newString=string.slice(string.indexOf("remind me to")+"remind me to".length+1,string.indexOf(results[0].text));
    console.log(newString);
    var a = new reminder({
           number:req.body.From,
           message:newString,
           dateOfReminder:dateNeeded,
           originalString:req.body.Body,
           scheduled: false,
           finished: false
        });

    
   // if(a.dateOfReminder.getTime()>Date.now()){
        
        var eta = dateNeeded.getTime() - Date.now();
          console.log('eta: '+eta+ "    "+eta/60000+ " minutes    "+eta/1000+" seconds");
        if (eta<50000){
          if (eta<5000){
            eta=5000;
          }
          a.scheduled=true;
          a.finished=true;
          setTimeout(sendNow.bind(null, a) , eta);
        }
        a.save();
         
   //   }



    twiml.message((new Date(a.dateOfReminder)).toLocaleString()+'reminder has been scheduled on '+a.dateOfReminder + ' with message: '+a.message);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    console.log(req.body.Body);
    res.end(twiml.toString());
  });

  function sendNow(m) { 
          console.log("sending reminder: "+m.message);
          client.messages.create({ 
          to: m.number, 
          from: "+18148063881", 
          body: m.message, 
        }, function(err, message) { 
            console.log(message.sid); 
        });
  }
  function findAndSchedule(){
    reminder.find({dateOfReminder: {lt: Date.now()+3*60000}}, function (err, docs){

      docs.forEach(function(doc) {
        doc.scheduled = true;;
        doc.save();
      });

      
    });
    //.sort({dateOfReminder:1})

  }
 // setTimeout(runOnce, 4000);
  //runOnce();
  var server = http.listen(app.get('port') , function () {
      console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
  });



  // Twilio Credentials 
  var accountSid = 'AC781a0833a4249069bcf3ae072619d368'; 
  var authToken = 'ff1c34b4d97f8aae459ffb4dcb62efba'; 
   
  //require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 
   
  client.messages.create({ 
    //  to: "+16107419998", 
      to: "+18149698492", 
      from: "+18148063881", 
      body: "tminder app has been started ", 
  }, function(err, message) { 
      if(err){

      }
      else{
        console.log(message.sid);   
      }
      
  });





  // 1
  var io = require('socket.io')(http);


  // we wont need this anymore because we are using mySQL not mongoDB
  ////////////////////////////////////  
  var mongoose = require('mongoose');


  mongoose.connect('mongodb://admin1:serverpass3141@ds035806.mlab.com:35806/tminder');

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
  app.get('/pages/*', function (req, res) {
    res.sendFile(__dirname+ req.path);
  });

  app.get('/images/*', function (req, res) {
    res.sendFile(__dirname+ req.path);
  });


  io.on('connection', function(socket) {
    socket.on('disconnect', function() {
      console.log('someone left');
    });
    socket.on('get reminders', function(msg) {
      
      reminder.find({number:msg} ,function (err, doc){
          if(err){
            console.log("error");
          }
          else{
            io.emit('reminders', doc);
          }
          
      });
    });
    socket.on('submit reminder', function(msg){
      console.log('submit reminder recieved');
      console.log(msg.message);

      var string=msg.message;
  

    var results = chrono.parse(string);
    var dateNeeded=  results[0].start.date();
    console.log(string+' dateneeded: '+ dateNeeded);
    var newString=string.slice(string.indexOf("remind me to")+"remind me to".length+1,string.indexOf(results[0].text));
    console.log(newString);
    var a = new reminder({
           number:msg.number,
             message:newString,
             dateOfReminder:dateNeeded,
           originalString:string,
           scheduled: false,
           finished: false
        });

    
   // if(a.dateOfReminder.getTime()>Date.now()){
        
        var eta = dateNeeded.getTime() - Date.now();
          console.log('eta: '+eta+ "    "+eta / 60000+ " minutes    "+eta/1000+" seconds");
        if (eta<50000){
          if (eta<5000){
            eta=5000;
          }
          a.scheduled=true;
          a.finished=true;
          setTimeout(sendNow.bind(null, a) , eta);
        }
        a.save();





   



      // twiml.message('reminder has been scheduled on '+a.dateOfReminder + ' with message: '+a.message);


    });

    socket.on('button clicked', function(msg) {

      io.emit('button was clicked', msg);
    });
  });
  var reminders;
  setInterval(myMethod, 30000);
setTimeout(myMethod, 30000);
function myMethod( ){
  console.log('checking for reminders...');
  // reminder.find({dateOfReminder:{$and:[{$gt:Date.now()},{$lt:Date.now()+60000}]}}).sort({dateOfReminder:1}).exec(function(err,doc){
      reminder.find({dateOfReminder:{$gt:Date.now()-10000,$lt:Date.now()+60000}}).sort({dateOfReminder:1}).exec(function(err,doc){
 //   reminder.find().sort({dateOfReminder:1}).exec(function(err,doc){
    reminders=doc; 
     var eta;
    for(var i in reminders){
      if(reminders[i].scheduled==false){
        eta = new Date(reminders[i].dateOfReminder);
        eta= eta.getTime() - Date.now();
        if(eta<5000){
          eta=5000;
        }
        reminders[i].scheduled=true;
        reminders[i].save();
        setTimeout(schedule.bind(null, reminders[i]) , eta);
        
        console.log('scheduled: '+ reminders[i].message);
      }
      else{
        //console.log('already scheduled: ' + reminders[i].message);
      }
      
    }
  });
}





  function runOnce( )
  {
    console.log("run once");
    reminder.find({}).sort({dateOfReminder:1}).exec(function(err,doc){
       reminders=doc;  
    });
    //console.log(reminders);
    var eta_ms;
    for(var i in reminders){
      //console.log(eta_ms);
      // console.log("loop");
      // console.log(reminders[i]);
      //    console.log(reminders[i].message);
      //if(reminders[i].dateOfReminder>Date.now){
        if(reminders[i].dateOfReminder.getTime()>Date.now()){
          console.log(reminders[i].message);



         eta_ms = reminders[i].dateOfReminder - Date.now();
         setTimeout(schedule.bind(null, reminders[i]) , eta_ms);
      }
    } 
  }

  function schedule(m) { 
          console.log("scheduling"+m.message);
          client.messages.create({ 
          to: m.number, 
          from: "+18148063881", 
          body: m.message, 
        }, function(err, message) { 
            console.log(message.sid); 
        });
  }
  // setTimeout(runOnce, 4000);
  //runOnce();
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