//Libs
var credentials = require('./../credentials.js');	//connections strings
var mongoose = require('mongoose');							//DB driver
//DB models
var Student = require('./models/student.js');
var Event = require('./models/event.js');
var GroupType = require('./models/group-type.js');

mongoose.connection.on('error',function (err) {
	console.log(err + 'My method');
});

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
		group: {groupType: 'base', name: 'Базовый'},
		introLectionDate: new Date(2016, 2, 10),
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
			admin: "Вика Евдокимова",
			date: "2017-03-15T21:00:00.000Z",
			description: "Совместное занятие с МГ",
			groups: [{
				groupType: "base", 
				name: "Базовый"
			}],
			name: "Предисловие к ТЭ\"С, пункты 51-54",
			students: [],
			teachers: ["Тимур Абдулкадыров", "Андрей Гумиров"]
		}).save();

		// new Event({
		// 	name: 'Урок Зоар',
		// 	type: 'Урок молодёжной группы',
		// 	date: new Date(2017, 3, 2),	//2 March 2017
		// 	startTime: new Date(2017, 3, 2),
		// 	endTime: new Date(2017, 3, 2),
		// 	description: 'Полчаса собрание молодёжной группы, затем урок Зоар с Равом',
		// 	teachers: ['Иванов', 'Петров'],
		// 	administrators: ['Вика'],
		// 	students: ['589ef5818f7c81228090fb46']
		// }).save();
	});
}

function fillInitialGroupTypeData() {
	GroupType.find(function(err, groupTypes) {
		if (err) console.log(err);
		if (groupTypes.length) {
			GroupType.remove(function(err, data) {
				new GroupType({
					type: 'intro',
					name: 'Вводный',
					shortName: 'В'
				}).save();
				new GroupType({
					type: 'base',
					name: 'Базовый',
					shortName: 'Б'
				}).save();
				new GroupType({
					type: 'young',
					name: 'Молодёжная группа',
					shortName: 'М'
				}).save();
				new GroupType({
					type: 'main',
					name: 'Основная группа',
					shortName: 'О'
				}).save();
				new GroupType({
					type: 'club',
					name: 'Каб. клуб',
					shortName: 'К'
				}).save();
				new GroupType({
					type: 'another',
					name: 'Другое',
					shortName: 'Д'
				}).save();
			});
		};
	});
}

module.exports.setDBConnection = setDBConnection;
module.exports.fillInitialStudentData = fillInitialStudentData;
module.exports.fillInitialEventData = fillInitialEventData;
module.exports.fillInitialGroupTypeData = fillInitialGroupTypeData;