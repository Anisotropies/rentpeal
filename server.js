// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.static(__dirname+'/public'));
app.use(express.static('views'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/thanks.html');
});


// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Our app is running on http://localhost:' + port);
});

var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var url = process.env.MONGOLAB_URI;

var dbConn = mongodb.MongoClient.connect(url);

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/post-feedback', function (req, res) {
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });
    res.sendFile('views/thanks.html', {root: __dirname })
    //res.send('Data received:\n' + JSON.stringify(req.body));
	res.end();
});

app.get('/view-feedbacks',  function(req, res) {
    dbConn.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});
