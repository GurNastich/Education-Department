//Vendor
var express = require('express');

//Libs
var mottos = require('./lib/mottos');
var credentials = require('./credentials.js');

//App
var app = express();

//DB configuration
var mongoose = require('mongoose');
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};

switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, options);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, options);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

//Set port
app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(__dirname + '/public'));


app.get('*', function(req, res) {
    res.sendFile('./public/index.html');
});

//404
app.use(function(req, res) {
    res.status(404);
    res.render('404');
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
