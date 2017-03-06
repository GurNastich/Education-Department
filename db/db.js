//Libs
var credentials = require('./../credentials.js');	//connections strings
var mongoose = require('mongoose');							//DB driver
//DB models
var Student = require('./models/student.js');
var Event = require('./models/event.js');

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
		group: {groupType: 'base', name: 'Базовый 3-16'},
		transitions: {
			toBaseGroup: new Date(2016, 3, 14)	//14 April 2016
		}
}).save();
	});
}

function fillInitialEventData() {
//Fill some data if no any
	Event.find(function(err, events) {
		if (err) console.log(err);
		if (events.length) return;


		new Event({
		name: 'Урок Зоар',
		type: 'Урок молодёжной группы',
		date: new Date(2017, 3, 2),	//2 March 2017
		startTime: new Date(2017, 3, 2),
		endTime: new Date(2017, 3, 2),
		description: 'Полчаса собрание молодёжной группы, затем урок Зоар с Равом',
		teachers: ['Иванов', 'Петров'],
		administrators: ['Вика'],
		students: ['589ef5818f7c81228090fb46']
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
module.exports.fillInitialEventData = fillInitialEventData;