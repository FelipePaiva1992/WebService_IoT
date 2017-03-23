var express = require('express');
var app = express();

app.get('/',function(req,res) {
        res.send('FIAP IOT POHAA');
});

app.all('/*', function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTION");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept, X-Access-Token, X-Key,x-request-with");
    if(req.method == 'OPTIONS'){
        res.status(200).end;
    }else{
        next();
    }
});


var server = app.listen(3000);
console.log('Servidor na porta %s', server.address().port);

var five = require("johnny-five");
var board = new five.Board({port : 'COM3'});

var relay;
var temperature;
var photoresistor;
var ligado;

board.on("ready", function() {
    console.log("Arduino Conectado");
    relay = new five.Relay(12);

    temperature = new five.Thermometer({
        controller: "LM35",
        pin: "A0"
    });

    photoresistor = new five.Sensor({
        pin: "A1",
        freq: 250
    });

    board.repl.inject({
        pot: photoresistor
    });

    photoresistor.on("data", function() {
        if(this.value >= 250 || ligado){
            relay.on();
        }else{
            relay.off();
        }
    });
});


app.get('/on', function(req,res) {
    //relay.on();
    ligado = true;
    res.send('Lampada ligada');
})

app.get('/off', function(req,res) {
    //relay.off();
    ligado = false;
    res.send('Lampada desligada');
})

app.get('/tmp', function(req,res) {
    res.send('Temperatura ' + temperature.celsius + " ºC" );
})