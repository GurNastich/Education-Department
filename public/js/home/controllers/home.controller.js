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
			var initDateFrom = $scope.dateFrom;
			var initDateTo = $scope.dateTo;

			$scope.dateFrom = moment($scope.dateFrom.toLocaleString()).format('D-MMM-YYYY');
			$scope.dateTo = moment($scope.dateTo.toLocaleString()).format('D-MMM-YYYY');

			$scope.fillTable = function() {
				$scope.calcTable = true;
				$scope.students = [];
				$scope.dates = [];
				var currentMonths = [];
				var dateFrom = $scope.dateFrom;
				if (typeof $scope.dateFrom === 'string') {
					dateFrom = initDateFrom;
				}
				var dateTo = $scope.dateTo;
				if (typeof $scope.dateTo === 'string') {
					dateTo = initDateTo;
				}
				for (var i = new Date(dateFrom); i <= dateTo; i.setDate(i.getDate() + 1)) {
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
			 		//set student group according last filled date of transition
			 		_.each($scope.students, function(student) {
			 			if (student.transitions) {
				 			if (student.transitions.toMainGroup) {
				 				student.group = {
				 					groupType: 'main',
				 					name: 'Основная группа'
				 				}
				 			} else if (student.transitions.toYoungGroup) {
				 				student.group = {
				 					groupType: 'young',
				 					name: 'Молодёжная группа'
				 				}
				 			} else if (student.transitions.toBaseGroup) {
				 				student.group = {
				 					groupType: 'base',
				 					name: 'Базовый'
				 				}
				 			} else if (student.transitions.toIntroGroup) {
				 				student.group = {
				 					groupType: 'intro',
				 					name: 'Вводный'
				 				}
			 				}
			 			}
			 		});
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
						 		var dateFrom = $scope.dateFrom;
								if (typeof $scope.dateFrom === 'string') {
									dateFrom = initDateFrom;
								}
								var dateTo = $scope.dateTo;
								if (typeof $scope.dateTo === 'string') {
									dateTo = initDateTo;
								}
						 		for (var i = new Date(dateFrom); i < dateTo; i.setDate(i.getDate() + 1)) {
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
							$scope.allStudents = _.clone($scope.students);
							$scope.baseGroups = _.filter($scope.students, function(student) {
								if (!student.group) {
									return false;
								}
								return student.group.groupType === 'base';
							});
							$scope.baseGroups = _.map($scope.baseGroups, 'groupView');
							$scope.baseGroups = _.uniq($scope.baseGroups);
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

			$scope.isDateFromPopupOpen = false;

			$scope.openDateFromPopup = function() {
				$scope.isDateFromPopupOpen =! $scope.isDateFromPopupOpen;
			};

			$scope.isDateToPopupOpen = false;

			$scope.openDateToPopup = function() {
				$scope.isDateToPopupOpen =! $scope.isDateToPopupOpen;
			};

			$scope.fillTable();

			$scope.filterTable = function(val) {		
				if (val === 'all' || val === '') {		//'' - if base group value from the list was set to ''
					$scope.students = _.clone($scope.allStudents);
					return;
				}

				if (val === 'intro' || val === 'young' || val === 'club') {
					$scope.students = _.filter($scope.allStudents, function(stud) {
						return stud.group ? stud.group.groupType === val : false;
					});
					$scope.baseGroupFilter = '';
					return;
				}

				$scope.students = _.filter($scope.allStudents, {groupView: val});

			}
	});
})(angular);