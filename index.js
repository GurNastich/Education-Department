var express = require('express');
var db = require('./db/db');
var bodyParser = require('body-parser')

var Student = require('./db/models/student.js');
var Event = require('./db/models/event.js');
var GroupType = require('./db/models/group-type.js');

//App
var app = express();

db.setDBConnection(app);
// db.fillInitialStudentData();
// db.fillInitialGroupTypeData();
// db.fillInitialEventData();

//Set port
app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// API
app.get('/students', function(req, res) {
	if (req.query.types) {
		Student.find({'group.groupType': {$in : req.query.types}}, function(err, students) {
			res.json(students);
		});
	} else {
		 Student.find(function(err, students) {
		 	res.json(students);
		 });
	}
});

app.get('/lessons', function(req, res) {
	Event.find(function(err, lessons) {
		res.json(lessons);
	})
});

app.get('/grouptypes', function(req, res) {
	GroupType.find(function(err, groupTypes) {
		res.json(groupTypes);
	})
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
	new Event(req.body.lesson).save(function(err, lesson) {
		res.json(lesson);
	});
});

app.get('/lesson', function(req, res) {
	if (req.query.id) {
		Event.find({'_id': req.query.id}, function(err, lesson) {
			res.json(lesson);
		});
	}
});

app.get('/student', function(req, res) {
	if (req.query.id) {
		Student.find({'_id': req.query.id}, function(err, student) {
			res.json(student);
		});
	}
});

app.put('/student', function(req, res) {
	Student.update({_id: req.body.student._id}, req.body.student, function(err, student) {
		res.send();
	});
});

app.put('/lesson', function(req, res) {
	Event.update({_id: req.body.lesson._id}, req.body.lesson, function(err, lesson) {
		res.send();
	});
});

app.delete('/student', function(req, res) {
	Student.remove({_id: req.query.id}, function(err, student) {
		if (err) {
			res.send();
		}

		Student.find(function(err, students) {
			res.json(students);
		});
	});
});

app.delete('/lesson', function(req, res) {
	Event.remove({_id: req.query.id}, function(err, lesson) {
		if (err) {
			res.send();
		}

		Event.find(function(err, lessons) {
			res.json(lessons);
		});
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
