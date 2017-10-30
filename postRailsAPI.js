var mraa = require("mraa");
var request = require('request');
var five = require("johnny-five");
var Edison = require("edison-io");

var temp = 0
var humidity = 0
var presence = true
var json = {"sensor":{"temp":temp,"humidity":humidity,"presence": presence}}

var board = new five.Board({
  io: new Edison(),
  repl: false
});

board.on("ready", function() {
  var multi = new five.Multi({
    controller: "TH02"
  });

  multi.on("change", function() {
  	temp = this.thermometer.celsius;
  	humidity = this.hygrometer.relativeHumidity;
  });
});

var presenceSensor = new mraa.Gpio(7);

//RailsAPI
var uri = "xxxxxxxxxxxxx"

function presenceRead(){
	var presenceValue = presenceSensor.read();
    console.log(presenceValue);
    return presenceValue;
}

var setJson = function(){
	p = presenceRead();
	presence = p > 0.5 ? true : false;
	json = {"sensor":{"temp":temp,"humidity":humidity,"presence": presence}}
	console.log(json);
}

var apiPost = function(post_url, post_json){
	var options = {
		uri: post_url,
		headers: {
			"Content-type": "application/json",
		},
		json: post_json
	};
	request.post(options, function(error, response, body){});
	console.log("POST");
}

var postTransaction = function(){
	setJson();
	apiPost(uri, json);
	console.log("POST_TRANSACTION");
	console.log(json);
}

setInterval(postTransaction, 5000);
