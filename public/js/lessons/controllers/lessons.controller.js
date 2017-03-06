(function(angular) {
	'use strict';

	angular.module('lessonsModule')
		.controller('lessonsController', function($scope, $http) {
			$scope.lesson = {};
			$scope.students = [];
			var type = 'base';
			$http.get('/students', {params:{type: type}}).then(function(resp) {
				$scope.students = resp.data;
			}, function(err) {
				console.log(err);
			});

			$scope.validateName = function(val) {
				$scope.nameError = !val;
			};
			$scope.validateType = function(val) {
				$scope.typeError = !val;
			};
			$scope.validateDate = function(val) {
				$scope.dateError = !val;
			};

			$scope.saveLesson = function(lesson) {
				var validationError = false;

				if (!$scope.newLessonForm.name.$viewValue) {
					$scope.nameError = true;
					validationError = true;
				}
				if (!$scope.newLessonForm.type.$viewValue) {
					$scope.typeError = true;
					validationError = true;
				}
				if (!$scope.newLessonForm.date.$viewValue) {
					$scope.dateError = true;
					validationError = true;
				}

				if (validationError) {
					return;
				}

				lesson.students = _.filter($scope.students, {visit: true});
				//save only objectIds
				lesson.students = _.map(lesson.students, '_id');
				$http.post('/lesson', {lesson: lesson}).then(function(resp) {
					console.log(resp);
				}, function(err) {
					console.log(err);
				});
			};
		});
})(angular);