//Vendor
var express = require('express');

//Libs
var mottos = require('./lib/mottos');

//App
var app = express();

//View engine
//var handlebars = require('express-handlebars').create({
//    defaultLayout: 'main',
//    helpers: {
//        section: function(name, options) {
//            if(!this._sections) this._sections = {};
//            this._sections[name] = options.fn(this);
//            return null;
//        }
//    }
//});
//app.engine('handlebars', handlebars.engine);
//app.set('view engine', 'handlebars');

//Set port
app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(__dirname + '/public'));

//Tests
//app.use(function(req, res, next) {
//    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
//    next();
//});

//Routes
//app.get('/', function(req, res) {
//    res.render('home', {motto: mottos.getMotto()});
//});
//
//app.get('/about', function(req, res) {
//    res.render('about', {
//        pageTestScript: '/qa/tests-about.js'
//    });
//});
//
//app.get('/lesson-info', function(req, res) {
//    res.render('lesson-info');
//});
//
//app.get('/lesson-materials', function(req, res) {
//    res.render('lesson-materials');
//});

app.get('*', function(req, res) {
    console.log('* request');
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
