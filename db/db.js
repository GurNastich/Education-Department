//Libs
var credentials = require('./../credentials.js');	//connections strings
var mongoose = require('mongoose');							//DB driver
//DB models
var Student = require('./models/student.js');

function setDBConnection(app) {
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
}

function fillInitialStudentData() {
//Fill some data if no any
	Student.find(function(err, students) {
		if (err) console.log(err);
				console.log(students.length);
		if (students.length) return;


		new Student({
		name: 'Анастасия',
		lastName: 'Гуревич',
		patronymic: 'Андреевна',
		phones: ['8-921-774-19-62'],
		emails: ['gurevich.anastasiya@gmail.com','ngurevich23@mail.ru'],
		profileLinks: [{
			linkType: 'VK',
			linkName: 'https://vk.com/id43524735'
		}, {
			linkType: 'Facebook',
			linkName: 'https://www.facebook.com/profile.php?id=100009485595004'
		}],
		group: {groupType: 'base', groupName: 'Базовый 3-16'},
		transitions: {
			toBaseGroup: new Date(2016, 3, 14)	//14 April 2016
		}
		// visits: []
}).save();

		// new Student({
		// 	name: 'Ксения'
		// 	patronymic: 'Юрьевна',
		// 	lastName: 'Васенкова',
		// 	group: '01-16',
		// 	stream: 'Молодёжная группа',
		// 	phone: '89998887766',
		// 	email: 'vas@gma.com'
		// }).save();

	});
}

module.exports.setDBConnection = setDBConnection;
module.exports.fillInitialStudentData = fillInitialStudentData;