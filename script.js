var config = require("./config.js");

//var TelegramBot = require('node-telegram-bot-api');
//var localtunnel = require('localtunnel');
console.log(config)
var url =""; 
var tunnelFlag = false;

var exec = require('child_process').exec;

var tty = require('tty.js');

var app = tty.createServer({
  shell: 'bash',
  users: {
    //config['username']: config['password'] //Change Password
    "admin" : "admin"
  },
  port: 3000
});
var fileManager = require('express-file-manager');
/*
app.use(function (req, res, next) {
    if (req.path.indexOf("filemanager")>-1) {
        //Apio.user.email.push(req.session.email);
        next();
    }
});
app.use('/filemanager', fileManager());
*/

app.get('/foo', function(req, res, next) {
  res.send('bar');
});

app.listen();
/*
var tunnelInit = function(){
	var tunnel = localtunnel(port, function(err, tunnel) {
	if (err){
	    
	} else {
	    // the assigned public url for your tunnel
	    // i.e. https://abcdefgjhij.localtunnel.me
	    tunnelFlag = true;
	    url = tunnel.url;
	    
	}
	});
	
	tunnel.on('close', function() {
	 // tunnels are closed
	 tunnelFlag = false;
	 url = "";
	});
}
tunnelInit();
/*var token = <YOUR TELEGRAM TOKEN>;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
/*bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});*/
/*
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
    if(url===""){                                                         
          bot.sendMessage(chatId, "Your tunnel is offline, write me in a while"); 
          tunnelInit();                                                   
    } else {                                                              
          bot.sendMessage(chatId, "Hi, here's the address of your tunnel "+url);                                                                         
    }                                                                     
  }                                                                                             
});*/