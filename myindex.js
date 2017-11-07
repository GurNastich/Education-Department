var express = require('express');
var db = require('./db/db');
var bodyParser = require('body-parser');
var path = require('path');
var router = require('./controllers/studentController');

var app = express();

db.setDBConnection(app);

app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser());

app.use('/students?',router);