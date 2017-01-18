var mottos = require('./lib/mottos');

var express = require('express');

//App
var app = express();

//View engine
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Set port
app.set('port', process.env.PORT || 3000);

//Static files
app.use(express.static(__dirname + '/public'));

//Routes
app.get('/', function(req, res) {
    res.render('home', {motto: mottos.getMotto()});
});

app.get('/about', function(req, res) {
    res.render('about');
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
