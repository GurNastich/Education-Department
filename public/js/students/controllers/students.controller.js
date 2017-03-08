(function(angular) {
	'use strict';

	angular.module('studentsModule')
		.controller('studentsController', function($scope, $http) {

			$scope.groupTypes = [{
					type: 'intro_lection',
					displayName: 'Вводная лекция'
				}, {
					type: 'intro',
					displayName: 'Вводный'
				}, {
					type: 'base',
					displayName: 'Базовый'
				}, {
					type: 'young',
					displayName: 'Молодёжная группа'
				}, {
					type: 'main',
					displayName: 'Основная группа'
				}, {
					type: 'prestudent',
					displayName: 'Престьюдент'
				}, {
					type: 'club',
					displayName: 'Каб. клуб'
				}, {
					type: 'guest',
					displayName: 'Гость'
				}
			];

			$scope.students = [];
			$scope.phoneError = [];
			$scope.emailError = [];

			$http.get('/students').then(function(resp) {
				$scope.students = resp.data;
			}, function(err) {
				console.log(err);
			});
			$scope.student = {
				phones: [''],
				emails: [''],
				profileLinks: [{
					linkType: 'VK',
					linkName: ''
				}, {
					linkType: 'FB',
					linkName: ''
				}],
				transitions: {
					toIntroGroup: new Date()
				}
			};

			$scope.addPhone = function(student) {
				var empty = student.phones[student.phones.length - 1] === undefined ||
							student.phones[student.phones.length - 1] === '' ||
							student.phones[student.phones.length - 1] === null;
				if (empty) {
					$scope.phoneError[student.phones.length - 1] = true;
					return;
				}

				student.phones.push('');
			};

			$scope.addEmail = function(student) {
				var empty = student.emails[student.emails.length - 1] === undefined ||
							student.emails[student.emails.length - 1] === '' ||
							student.emails[student.emails.length - 1] === null;
				if (empty) {
					$scope.emailError[student.emails.length - 1] = true;
					return;
				}

				student.emails.push('');
			}

			$scope.validateLastNameField = function(val) {
				$scope.lastNameError = !val;
			};

			$scope.validateNameField = function(val) {
				$scope.nameError = !val;
			};

			$scope.validateGroupTypeField = function(val) {
				$scope.groupTypeError = !val;
			};

			$scope.validateGroupNameField = function(val) {
				$scope.groupNameError = !val;
			};

			var phonePattern = /[\d()-]+/;

			$scope.validatePhone = function(val, index) {
				val[index] = phonePattern.exec(val[index]); 
				if (!val[index]) {
					$scope.phoneError[index] = true;
					return;	
				}
				$scope.phoneError[index] = false;
			};

			$scope.validateEmail = function(val, index) {
				$scope.emailError[index] = false;
			};

			$scope.removeItem = function(array, index) {
				array.splice(index, 1);
			};

			$scope.saveUser = function(student) {
				var validationError = false;
				if (!$scope.newStudent.lastName.$viewValue) {
					$scope.lastNameError = true;
					validationError = true;
				}
				if (!$scope.newStudent.name.$viewValue) {
					$scope.nameError = true;
					validationError = true;
				}
				if (!$scope.newStudent.groupType.$viewValue) {
					$scope.groupTypeError = true;
					validationError = true;
				}
				if (!$scope.newStudent.groupName.$viewValue) {
					$scope.groupNameError = true;
					validationError = true;
				}

				if (student.phones.length > 1 && !student.phones[student.phones.length - 1]) {
					$scope.phoneError[student.phones.length - 1] = true;
					return;
				}

				if (validationError) {
					return;
				}
				$http.post('/saveUser', {student: student}).then(function(resp) {
					console.log(resp);
				}, function(err) {
					console.log(err);
				});
			};
		});
})(angular);