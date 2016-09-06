var config = require("./config.js");

var TelegramBot = require('node-telegram-bot-api');
var localtunnel = require('localtunnel');
console.log(config)
var urlSSH ="";
var urlFileManager="";
var tunnelFlag = false;

var http        = require('http'),
    cloudcmd    = require('cloudcmd'),
    express     = require('express'),
    io          = require('socket.io'),
    app         = express(),

    PORT        = 3001,
    PREFIX      = '/cloudcmd',
    server,
    socket;

server = http.createServer(app);
socket = io.listen(server, {
    path: PREFIX + '/socket.io'
});

app.use(cloudcmd({
    socket: socket,     /* used by Config, Edit (optional) and Console (required)   */
    config: {           /* config data (optional)                                   */
        prefix: PREFIX, /* base URL or function which returns base URL (optional)   */
        "auth"              : true,    /* enable http authentication               */
        "username"          : "admin",   /* username for authentication              */
        "password"          : config.login.admin   /* password hash in sha-1 for authentication*/
    }
}));

server.listen(PORT);

var chatIdAdmin = "19179822"

//var exec = require('child_process').exec;

/*exec("cloudcmd --port 3001", function (error, stdout, stderr) {
    if (error) {
        console.log("exec error: " + error);
    } else {
        console.log("FileManager server corretly start");
    }
});*/

var tty = require('tty.js');

var app = tty.createServer({
  shell: 'bash',
  users: {
    "admin" : config.login.admin
  },
  port: 3002
});


app.get('/foo', function(req, res, next) {
  res.send('bar');
});

app.listen();

var tunnelSSH = function(){
	var tunnelSSH = localtunnel(3002, function(err, tunnel) {
	if (err){

	} else {
	    // the assigned public url for your tunnel
	    // i.e. https://abcdefgjhij.localtunnel.me
	    tunnelFlag = true;
	    urlSSH = tunnel.url;
      if(urlFileManager!="") bot.sendMessage(chatIdAdmin, "Hi, here's the address of your SSH tunnel "+urlSSH+" and here is your FileManager tunnel "+urlFileManager);
      else bot.sendMessage(chatIdAdmin, "Hi, here's your SSH tunnel "+urlSSH+" and in a while you will have your FileManager url too.");

	}
	});

	tunnelSSH.on('close', function() {
	 // tunnels are closed
	 tunnelFlag = false;
	 urlSSH = "";
	});
}

var tunnelFileManager = function(){
	var tunnelFileManager = localtunnel(3001, function(err, tunnel) {
	if (err){

	} else {
	    tunnelFlag = true;
	    urlFileManager = tunnel.url;
      if(urlSSH!="") bot.sendMessage(chatIdAdmin, "Hi, here's the address of your SSH tunnel "+urlSSH+" and here is your FileManager tunnel "+urlFileManager);
      else bot.sendMessage(chatIdAdmin, "Hi, here's your fileManager tunnel "+urlFileManager+" and in a while you will have your ssh too.");
	}
	});

	tunnelFileManager.on('close', function() {
	 // tunnels are closed
	 tunnelFlag = false;
	 urlFileManager = "";
	});
}

tunnelSSH();
tunnelFileManager();
var token = config.telegramToken;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});


// Matches /echo [whatever]
/*bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});*/

bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  console.log(msg);
  if(msg.text=="reboot"){
     bot.sendMessage(chatId, "Ok, I will reboot!")
     setTimeout(function(){
            exec("sudo reboot", function (error, stdout, stderr) {
            if (error || stderr) {
            console.log("exec error: " + error || stderr);
        } else if (stdout) {
            console.log("Board is rebooting in a while, please wait");
        }
      },1000);
     })
  }
  else {
    if(urlSSH==="" && urlFileManager==""){
          bot.sendMessage(chatId, "Your tunnel is offline, write me in a while");
          tunnelSSH();
          tunnelFileManager();
    } else {
          bot.sendMessage(chatId, "Hi, here's the address of your SSH tunnel "+urlSSH+" and here is your FileManager tunnel "+urlFileManager);
    }
  }
});
