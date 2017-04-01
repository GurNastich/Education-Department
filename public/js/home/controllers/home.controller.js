(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http, $state) {
			var month;
			var days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
			var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
// $scope.options = {
// 	initDate: new Date(2017, 3, 11)
// }
// $scope.dateDisplayFormat = 'dd-MMMM-yyyy';
			$scope.dateFrom = new Date();	//Current date
			$scope.dateFrom = new Date(new Date($scope.dateFrom).setMonth($scope.dateFrom.getMonth() - 1));
			$scope.dateTo = new Date(new Date($scope.dateFrom).setMonth($scope.dateFrom.getMonth() + 1));	//+ 1 Month

			$scope.fillTable = function() {
				$scope.calcTable = true;
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
					$http.get('/lessons').then(function(response) {
						var lessons = response.data;
						$http.get('/grouptypes').then(function(response) {
							var groupTypes = response.data;
							_.each($scope.students, function(student) {
								student.visits = [];
								if (student.group && student.group.groupType === 'base') {
									var yearName = (new Date(student.introLectionDate).getFullYear()).toString();
									var monthName = (new Date(student.introLectionDate).getMonth() + 1).toString();
									monthName = monthName.length === 2 ? monthName : '0'+monthName;
									student.groupView = student.group.name + '-' + monthName +  + yearName.slice(-2);
								} else if (student.group) {
									// student.groupView = student.group ? student.group.name : '';
									student.groupView = student.group.name;
								} else if (student.introLectionDate) {
									student.groupView = 'Вводная лекция';
								} else {
									student.groupView = 'Престьюдент';
								}

							 	var studLessons = _.filter(lessons, function(lesson) {
								 	var a = _.findIndex(lesson.students, function(stud) {
										return stud.id === student._id;
								 	});
								 	return a > -1;
							 	});
						 		var k = 0;
						 		for (var i = new Date($scope.dateFrom); i < $scope.dateTo; i.setDate(i.getDate() + 1)) {
									var isLesson = _.find(studLessons, function(less) {
										var e = new Date(less.date);
										i.setHours(0,0,0,0);
										return e.getTime() === i.getTime();
							 		});
							 		if (isLesson) {
										student.visits[k] = {
											type: _.find(groupTypes, {type: isLesson.groups[0].groupType}).shortName,
											typeClass: isLesson.groups[0].groupType
											// type: _.find(groupTypes, {type: student.group.groupType}).shortName,
											// typeClass: student.group.groupType
								 		}
							 		} else {
										student.visits[k] = {
											type: '-'
										}
							 		}
									k++;
					 			}
							});
							$scope.baseGroups = _.filter($scope.students, function(student) {
								if (!student.group) {
									return false;
								}
								return student.group.groupType === 'base';
							});
							$scope.baseGroups = _.map($scope.baseGroups, 'groupView');
							$scope.baseGroups.unshift('');
						}, function(err) {
								 console.log(err);
						});
					}, function(err) {
				 			console.log(err);
					});
					$scope.calcTable = false;
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

			$scope.openStudentForm = function(student) {
				$state.go('student', {id: student._id});
			};

			$scope.fillTable();
	});
})(angular);