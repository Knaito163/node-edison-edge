var mraa = require("mraa");
var request = require('request');
var five = require("johnny-five");
var Edison = require("edison-io");

var temp = 0
var humidity = 0
var presence = true
var json = {"temp":temp,"humidity":humidity,"presence":presence}

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

//Firebase URL
var uri = "xxxxxxxxxxx"

function presenceRead(){
	var presenceValue = presenceSensor.read();
    console.log(presenceValue);
    return presenceValue;
}

var setJson = function(){
	p = presenceRead();
	presence = p > 0.5 ? true : false;
	json = {"temp":temp,"humidity":humidity,"presence":presence}
	console.log(json);
}

var apiPut = function(put_url, put_json){
	var options = {
		uri: put_url,
		headers: {
			"Content-type": "application/json",
		},
		json: put_json
	};
	request.put(options, function(error, response, body){});
	console.log("PUT");
}

var putTransaction = function(){
	setJson();
	apiPut(uri, json);
	console.log("PUT_TRANSACTION");
	console.log(json);
}

setInterval(putTransaction, 3000);

