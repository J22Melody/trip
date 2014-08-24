var express = require('express');
var app = express();

var fs = require('fs');

var bodyParser = require('body-parser');
// app.use(express.bodyParser());

app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({extended: true, limit: '50mb'})); // to support URL-encoded bodies

app.use("/", express.static(__dirname + '/'));

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.post('/savepath', function(req, res){
    // console.log(JSON.parse(req.body.path).routes);
    // console.log(req.body.place);
    var paths = require('./paths.json');
    paths[req.body.place] = req.body.path;
    fs.writeFile('paths.json', JSON.stringify(paths), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log(req.body.place + " saved to file");
        }
    });
    res.json({ success: true });
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
