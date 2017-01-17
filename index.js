var fortunes = [
    '\'У самого злого человека расцветает лицо, когда ему говорят, что его любят. Стало быть, в этом счастье.\'[© Лев Толстой]',
    '\'Когда другие люди с вами общаются, они на самом деле разговаривают со второстепенным персонажем своего рассказа. Все, что люди говорят о вас, есть всего лишь проекция образа, который они о вас       создали. Это не имеет ничего общего с вами.\' [© Мигель Руис]',
    '\'Невозможно потерять то, чего у тебя нет. А люди всё время теряют что-то, чего у них нет, что им никогда не принадлежало.\' [© Вэй Дэ-Хань]',
    '\'Прекрасное не может быть познано, его необходимо чувствовать или создавать.\' [© Иоганн Вольфганг Гете]'
];

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
    res.render('home', {fortune: fortunes[2]});
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
