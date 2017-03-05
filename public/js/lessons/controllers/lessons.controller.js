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

			$scope.saveLesson = function(lesson) {
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