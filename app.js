var express = require('express');
var app = express();

var fs = require('fs');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

app.use("/", express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendfile('index.html');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});


