(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http, $state, $q) {
			var month;
			var days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
			var months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
			var lessons, lessonTypes;

			$scope.dateFrom = new Date();	//Current date
			$scope.dateFrom = new Date(new Date($scope.dateFrom).setMonth($scope.dateFrom.getMonth() - 1));
			$scope.dateTo = new Date(new Date($scope.dateFrom).setMonth($scope.dateFrom.getMonth() + 1));	//+ 1 Month
			var initDateFrom = $scope.dateFrom;
			var initDateTo = $scope.dateTo;

			$scope.dateFrom = moment($scope.dateFrom.toLocaleString()).format('D-MMM-YYYY');
			$scope.dateTo = moment($scope.dateTo.toLocaleString()).format('D-MMM-YYYY');

			$scope.isDateFromPopupOpen = false;

			$scope.openDateFromPopup = function() {
				$scope.isDateFromPopupOpen =! $scope.isDateFromPopupOpen;
			};

			$scope.isDateToPopupOpen = false;

			$scope.openDateToPopup = function() {
				$scope.isDateToPopupOpen =! $scope.isDateToPopupOpen;
			};

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

				var studentsPromise = $http.get('students').then(function(resp){
					$scope.students = resp.data;
				});
				var lessonsPromise = $http.get('lessons').then(function(resp){
					lessons = resp.data;
				});
				var lessonTypesPromise = $http.get('lessonTypes').then(function(resp){
					lessonTypes = resp.data;
				});

				$q.all([studentsPromise, lessonsPromise, lessonTypesPromise]).then(function(resp) {

					_.each($scope.students, function(student) {
						student.visits = [];
						
						// Group name column
						// add day and month to base and intro types
						if (student.type === "Базовый" || student.type === "Вводный") {
							 var yearName = (new Date(student.introLectionDate).getFullYear()).toString();
							 var monthName = (new Date(student.introLectionDate).getMonth() + 1).toString();
							student.groupView = student.type + ' - ' + monthName +  + yearName.slice(-2);
						} else {
							student.groupView = student.type;
						}
						
						//filter all lessons for current student
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

						//Filter lessons for selected dates
						 for (var i = new Date(dateFrom); i < dateTo; i.setDate(i.getDate() + 1)) {
							var isLesson = _.find(studLessons, function(less) {
								var e = new Date(less.date);
								i.setHours(0,0,0,0);
								return e.getTime() === i.getTime();
							 });
							 
							 if (isLesson) {
								 var lessonType = _.find(lessonTypes, {type: isLesson.type});

								student.visits[k] = {
									type: lessonType ? lessonType.shortName : '?',
									typeClass: isLesson.type ? isLesson.type : 'unknown'
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

					$scope.baseGroups = _.filter($scope.students, {type: 'Базовый'});
					$scope.introGroups = _.filter($scope.students, {type: 'Вводный'});

					$scope.baseGroups = _.map($scope.baseGroups, 'groupView');
					$scope.introGroups = _.map($scope.introGroups, 'groupView');
					
					$scope.baseGroups = _.uniq($scope.baseGroups);
					$scope.introGroups = _.uniq($scope.introGroups);

					$scope.baseGroups.unshift('');
					$scope.introGroups.unshift('');

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

			$scope.filterTable = function(val) {		
				if (val === 'all' || val === '') {		//'' - if base group value from the list was set to ''
					$scope.students = _.clone($scope.allStudents);
					return;
				}

				if (val === 'intro' || val === 'young' || val === 'club') {
					$scope.students = _.filter($scope.allStudents, function(stud) {
						return stud.type === val;
					});
					$scope.baseGroupFilter = '';
					return;
				}

				$scope.students = _.filter($scope.allStudents, {groupView: val});
			}

			$scope.fillTable();
	});
})(angular);
