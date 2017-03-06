var express = require('express');
var db = require('./db/db');
var bodyParser = require('body-parser')

var Student = require('./db/models/student.js');
var Event = require('./db/models/event.js');

//App
var app = express();
db.setDBConnection(app);
db.fillInitialStudentData();
db.fillInitialEventData();

//Set port
app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// API
app.get('/students', function(req, res) {
	if (req.query.type) {
		Student.find({'group.groupType': req.query.type}, function(err, students) {
			res.json(students);
		});
	} else {
		 Student.find(function(err, students) {
		 	res.json(students);
		 });
	}
});

// app.get('*', function(req, res) {
// 		console.log('get *');
//     res.sendFile('./public/index.html');
// });

app.post('/saveUser', function(req, res) {
	new Student(req.body.student).save(function(err, student) {
		res.json(student);
	});
});

app.post('/lesson', function(req, res) {
	console.log(req.body.lesson);
	new Event(req.body.lesson).save(function(err, lesson) {
		console.log(err);
		console.log(lesson);
		res.json(lesson);
	});
});

//404
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
