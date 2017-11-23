(function(angular) {
	'use strict';

	function mapLessons(lessons) {
		_.each(lessons, function(lesson) {
			lesson.date = new Date(lesson.date).toLocaleString('ru', {day: 'numeric', month: 'short', year: 'numeric'});

			var lessonType = '';
			_.each(lesson.groups, function(group) {
				lessonType += group.name + ', ';
			});
			
			lesson.type = lessonType.slice(0, -2);
		});


		return lessons;
	}

	angular.module('lessonsModule')
		.controller('lessonsController', function($scope, $http, $state, $rootScope) {


			$http.get('stuff/teachers').then(function (resp) {
				$scope.teachers = resp.data;
			});
			
			$http.get('stuff/admins').then(function (resp) {
					$scope.admins = resp.data;
			});

			$rootScope.$broadcast('showLoader', 'Загрузка уроков');

			$http.get('/lessons').then(function(resp) {
				$scope.lessons = mapLessons(resp.data);
				$rootScope.$broadcast('hideLoader');
			}, function(err) {
				$rootScope.$broadcast('hideLoader');
				console.log(err);
			});

			$http.post('stuff',{teachers : lesson.teachers, admin : lesson.admin});

			$scope.removeLesson = function(lesson) {
				$rootScope.$broadcast('showLoader', 'Удаление урока из базы данных');
				$http.delete('/lesson', {params:{id: lesson._id}}).then(function(resp) {
					$scope.lessons = mapLessons(resp.data);


					$rootScope.$broadcast('hideLoader');
				}, function(err) {
					$rootScope.$broadcast('hideLoader');
					console.log(err);
				});
			};

			$scope.openLesson = function(lesson) {
				$state.go('lesson', {id: lesson._id});
			};

		});
})(angular);
