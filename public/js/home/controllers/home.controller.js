(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http) {
			var days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
			var months = ['Январь', 'Февраль', 'Март'];

			var types = [{
				type: 'Базовый',
				displayName: 'Б',
				typeClass: 'basic'
			}, {
				type: 'Вводный',
				displayName: 'В',
				typeClass: 'intro'
			}, {
				type: 'Молодёжная группа',
				displayName: 'М',
				typeClass: 'young'
			}];

			$scope.students = [];
			$scope.dates = [];

			$scope.dateChange = function() {
				$scope.currentMonth = months[$scope.dateFrom.getMonth()];
				for (var i = new Date($scope.dateFrom); i < $scope.dateTo; i.setDate(i.getDate() + 1)) {
					$scope.dates.push({
						weekDay: days[i.getDay()],
						dayNumber: i.getDate()
					});
				}

				$http.get('/students').then(function(response) {
					$scope.students = response.data;

					$http.get('/lessons').then(function(resp) {
						_.each($scope.students, function(student) {
							student.visits = [];
							var studLessons = _.filter(resp.data, function(lesson) {
								var a = _.findIndex(lesson.students, function(stud) {
									return stud === student._id;
								});
								return a > -1;
							});

							var k = 0;
							for (var i = new Date($scope.dateFrom); i < $scope.dateTo; i.setDate(i.getDate() + 1)) {
								var isLesson = _.find(studLessons, function(less) {
									var e = new Date(less.date);
									e.setDate(e.getDate() - 1);
									return e.getTime() === i.getTime();
								});
								if (isLesson) {
									student.visits[k] = {
										type: _.find(types, {type: isLesson.type}).displayName,
										typeClass: _.find(types, {type: isLesson.type}).typeClass
									}
								} else {
									student.visits[k] = {
										type: '-'
									}
								}
								k++;
							}
						});
						console.log($scope.dateFrom);
						console.log($scope.dateTo);
					}, function(err) {
						console.log(err);
					});
				}, function(err) {
					console.log(err);
				});
			};

			$scope.toggleFromDataPicker = function() {
				$scope.fromOpen = !$scope.fromOpen;
			};
			$scope.toggleToDataPicker = function() {
				$scope.toOpen = !$scope.toOpen;
			};

		});
})(angular);