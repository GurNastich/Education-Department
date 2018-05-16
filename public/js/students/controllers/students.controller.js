(function(angular) {
	'use strict';

	angular.module('studentsModule')
		.controller('studentsController', function($scope, $http, $state, $stateParams, $rootScope, notificationService) {

			$scope.students = [];

			// $http.get('grouptypes').then(function(resp) {
			// 	$scope.groupTypes = resp.data;
			// }, function(err) {
			// 	console.log(err);
			// });

			$rootScope.$broadcast('showLoader', 'Загрузка студентов');

			$http.get('students').then(function(resp) {
				$scope.students = resp.data;
				_.each($scope.students, function(student) {
					// if (student.introLectionDate) {
					// 	student.group = {
					// 		groupType: 'prestudent',
					// 		name: 'Престьюдент'
					// 	}
					// }
					// if (student.transitions) {
					// 	if (student.transitions.toMainGroup) {
					// 		student.group = {
					// 			groupType: 'main',
					// 			name: 'Основная группа'
					// 		}
					// 	} else if (student.transitions.toYoungGroup) {
					// 		student.group = {
					// 			groupType: 'young',
					// 			name: 'Молодёжная группа'
					// 		}
					// 	} else if (student.transitions.toBaseGroup) {
					// 		student.group = {
					// 			groupType: 'base',
					// 			name: 'Базовый'
					// 		}
					// 	} else if (student.transitions.toIntroGroup) {
					// 		student.group = {
					// 			groupType: 'intro',
					// 			name: 'Вводный'
					// 		}
					// 	}
					// }
				});
				$rootScope.$broadcast('hideLoader');
			}, function(err) {
				console.log(err);
				$rootScope.$broadcast('hideLoader');
			});			

			$scope.openStudent = function(student) {
				$state.go('student', {id: student._id});
			};

			$scope.removeStudent = function(student) {
				$rootScope.$broadcast('showLoader', 'Удаление студента из базы данных');
				$http.delete('student', {params:{id: student._id}}).then(function(resp) {
					$scope.students = resp.data;
					$rootScope.$broadcast('hideLoader');
				}, function(err) {
					$rootScope.$broadcast('hideLoader');
					console.log(err);
				});
			};
		});
})(angular);
