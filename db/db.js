//Libs
let credentials = require('./../credentials.js');	//connections strings
let mongoose = require('mongoose');					//DB driver
let _ = require('lodash');

//DB models
let Student = require('./models/student.js');
let Event = require('./models/event.js');
let LessonType = require('./models/lesson-type.js');
let StudentType = require('./models/student-type.js');
let Stuff = require('./models/stuff');

const lessonTypes = [{
	type: 'intro',
	name: 'Вводный',
	shortName: 'В'
}, {
	type: 'base',
	name: 'Базовый',
	shortName: 'Б'
}, {
	type: 'young',
	name: 'Молодежная группа',
	shortName: 'МГ'
}, {
	type: 'club',
	name: 'КаббКлуб',
	shortName: 'К'
}, {
	type: 'women',
	name: 'Женское собрание',
	shortName: 'ЖС'
}, {
	type: 'another',
	name: 'Другое',
	shortName: 'Д'
}, {
	type: 'baseAndYoung',
	name: 'Базовый + Молодежная группа',
	shortName: 'БМ'
}];


const studentTypes = ['Престьюдент', 'Вводный', 'Базовый', 'Молодежная группа', 'Основная', 'Френдли', 'Отказ'];

// const studentTypes = [{
// 	type: 'prestudent',
// 	name: 'Престьюдент'
// }, {
// 	type: 'intro',
// 	name: 'Вводный'
// }, {
// 	type: 'base',
// 	name: 'Базовый'
// }, {
// 	type: 'young',
// 	name: 'Молодежная группа'
// }, {
// 	type: 'main',
// 	name: 'Основная'
// }, {
// 	type: 'friendly',
// 	name: 'Френдли'
// }, {
// 	type: 'refuse',
// 	name: 'Отказ'
// }];

mongoose.connection.on('error',function (err) {
	console.log(err + 'My method');
});

mongoose.connection.on('open',function (err) {
	createStuffCollection();
	createLessonTypeCollection();
	createStudentTypeCollection();
	createEventCollection();
	createStudentCollection();
});

function setDBConnection(app) {
	var options = {
		server: {
			socketOptions: { keepAlive: 1 } 
		},
		useMongoClient : true
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

function createStuffCollection() {
	mongoose.connection.db.listCollections({name : 'stuff'}).next(function (err,col) {
		if(col){
			return;
		}
		else {
			mongoose.connection.db.createCollection('stuff');
			new Stuff({name : 'Афанасий Фет',
                type : 'teacher'}).save();
		}
    });
}

function createLessonTypeCollection() {
	mongoose.connection.db.listCollections({name : 'lessonType'}).next(function (err,col) {
		if(col){
			return;
		}
		else {
			mongoose.connection.db.createCollection('lessonType');
			_.each(lessonTypes, lesson => {
				new LessonType({
					type : lesson.type,
					name : lesson.name,
					shortName: lesson.shortName
				}).save();
			});
		}
    });
}

function createStudentTypeCollection() {
	mongoose.connection.db.listCollections({name : 'studentType'}).next(function (err,col) {
		if(col){
			return;
		}
		else {
			mongoose.connection.db.createCollection('studentType');
			_.each(studentTypes, type => {
				new StudentType({
					type : type
				}).save();
			});
		}
    });
}

function createStudentCollection() {
	mongoose.connection.db.listCollections({name : 'student'}).next(function (err,col) {
		if (col){
			return;
		}
		else {
			mongoose.connection.db.createCollection('student');
			new Student({
				name : 'Светлана',
				lastName : 'Закирьянова',
				patronymic: 'Андреевна',
				agreementNum: '9991122',
				numberBSO: '90-673AB',
				phones: ['8-921-774-19-62'],
				emails: ['gurevich.anastasiya@gmail.com','ngurevich23@mail.ru'],
				profileLinks: [{
					linkType: 'VK',
					linkName: 'https://vk.com/id43524735'
				}, {
					linkType: 'Facebook',
					linkName: 'https://www.facebook.com/profile.php?id=100009485595004'
				}],
				group: 'base',
				introLectionDate: new Date(2016, 2, 10),
				transitions: {
					toBaseGroup: new Date(2016, 3, 14)	//14 April 2016
				}
			}).save();
		}
    });
}

function createEventCollection() {
	mongoose.connection.db.listCollections({name : 'event'}).next(function (err,col) {
		if (col){
			return;
		}
		else {
			mongoose.connection.db.createCollection('event');
			new Event({
				name: "Предисловие к ТЭ\"С, пункты 51-54",
				type: "base",
				number: "2",
				// groups: [{
				// 	groupType: "base", 
				// 	name: "Базовый"
				// }],
				date: "2017-03-15T21:00:00.000Z",
				admin: "Вика Евдокимова",
				description: "Рабаш письмо 48",
				students: [],
				teachers: ["Тимур Абдулкадыров", "Андрей Гумиров"]
			}).save();
		}
    });
}

module.exports.setDBConnection = setDBConnection;