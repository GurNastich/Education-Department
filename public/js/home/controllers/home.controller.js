(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http) {
			var month;
			var days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
			var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
// $scope.options = {
// 	initDate: new Date(2017, 3, 11)
// }
// $scope.dateDisplayFormat = 'dd-MMMM-yyyy';
			$scope.dateFrom = new Date();	//Current date
			$scope.dateTo = new Date(new Date($scope.dateFrom).setMonth($scope.dateFrom.getMonth() + 1));	//+ 1 Month

			$scope.fillTable = function() {
				$scope.students = [];
				$scope.dates = [];
				var currentMonths = [];
				for (var i = new Date($scope.dateFrom); i <= $scope.dateTo; i.setDate(i.getDate() + 1)) {
					$scope.dates.push({
						weekDay: days[i.getDay()],
						dayNumber: i.getDate()
					});
					month = months[i.getMonth()];
					if (currentMonths.indexOf(month) === -1) {
						currentMonths.push(month);
					}
				}
				$scope.currentMonth = currentMonths.join('-');
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
									$http.get('/grouptypes').then(function(resp) {
										var groupTypes = resp.data;

								 		var k = 0;
								 		for (var i = new Date($scope.dateFrom); i < $scope.dateTo; i.setDate(i.getDate() + 1)) {
											var isLesson = _.find(studLessons, function(less) {
												var e = new Date(less.date);
												i.setHours(0,0,0,0);
												console.log('bd date');
												console.log(e.getTime());
												console.log(e);
												console.log('cur date');
												console.log(i.getTime());
												console.log(i);
												return e.getTime() === i.getTime();
									 		});
									 		if (isLesson) {
												student.visits[k] = {
													type: _.find(groupTypes, {type: isLesson.type}).shortName,
													typeClass: isLesson.type
										 		}
									 		} else {
												student.visits[k] = {
													type: '-'
												}
									 		}
											k++;
							 			}
							 		}, function(err) {
							 			console.log(err);
						 			});
						});
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

			$scope.fillTable();

		});
})(angular);