var express = require('express');
var db = require('./db/db');
var bodyParser = require('body-parser');
var path = require('path');
var Strouter = require('./controllers/studentController');
var Lsrouter = require('./controllers/lessonsController');
var GroupType = require('./db/models/group-type.js');
var StuffRouter = require('./controllers/stuffController');

var app = express();

db.setDBConnection(app);


app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(path.join(__dirname,'/public')));
app.use(bodyParser());

app.use('/students?',Strouter);
app.use('/stuff',StuffRouter);

app.get('/grouptypes', function(req, res) {
    GroupType.find(function(err, groupTypes) {
        res.json(groupTypes);
    })
});

app.use('/lessons?',Lsrouter);

app.use(function(req, res) {
    res.status(404);
    // res.render('404');
    res.send('404');
});

//500
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.send('500');
});

app.listen(app.get('port'), function() {
    console.log('Application is running on http://localhost:' + app.get('port') + '; press Ctrl+C for exit');
});
