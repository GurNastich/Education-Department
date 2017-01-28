//Vendor
var express = require('express');

//Libs
var mottos = require('./lib/mottos');
var credentials = require('./credentials.js');

//DB models
var Student = require('./db/models/student.js');
var BasicGroup = require('./db/models/basicGroup.js');

//Fill some data if no any
Student.find(function(err, students) {
	if (err) console.log(err);
	
	if (students.length) return;

	new Student({
		name: 'Анастасия',
		patronymic: 'Андреевна',
		lastName: 'Гуревич',
		group: '03-16',
		stream: 'Базовый',
		phone: '89217741962',
		email: 'gurevich.anastasia@gmail.com'
	}).save();

	new Student({
		name: 'Ксения',
		patronymic: 'Юрьевна',
		lastName: 'Васенкова',
		group: '01-16',
		stream: 'Молодёжная группа',
		phone: '89998887766',
		email: 'vas@gma.com'
	}).save();
});

//Fill some data if no any
BasicGroup.find(function(err, groups) {
	if (err) console.log(err);
	
	if (groups.length) return;

	new BasicGroup({
		name: '03-16',
		startDate: new Date(2016, 10, 3),	// 10 March 2016
		endDate: new Date(2016, 21, 5)
	}).save();

	new BasicGroup({
		name: '01-16',
		startDate: new Date(2016, 1, 17),
		endDate: new Date(2016, 10, 3)
	}).save();
});

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
// console.log('lll');

app.get('/api', function(req, res) {
	console.log('get /api');
});

app.get('/students', function(req, res) {


	Student.find(function(err, students) {
		res.json(students);
	});
});

app.get('/basicgroups', function(req, res) {
	BasicGroup.find(function(err, groups) {
		res.json(groups);
	});
});

// app.get('*', function(req, res) {
// 		console.log('get *');
//     res.sendFile('./public/index.html');
// });

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
