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
			$http.get('/students').then(function(resp) {
				$scope.students = resp.data;
			}, function(err) {
				console.log(err);
			});
			$scope.student = {
				phones: [''],
				emails: [''],
				profileLinks: [{
					linkType: '',
					linkName: ''
				}]
			};

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