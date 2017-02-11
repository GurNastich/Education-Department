var express = require('express');
var db = require('./db/db')
//App
var app = express();
db.setDBConnection(app);
db.fillInitialStudentData();

//Set port
app.set('port', process.env.PORT || 3000);

//Serve static files
app.use(express.static(__dirname + '/public'));

// API
app.get('/students', function(req, res) {
	Student.find(function(err, students) {
		res.json(students);
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
