(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http) {
			var days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
			var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// $scope.options = {
// 	initDate: new Date(2017, 3, 11)
// }
			$scope.students = [];
			$scope.dates = [];
			$scope.dateFrom = new Date();	//Current date
			$scope.dateTo = new Date(new Date($scope.dateFrom).setMonth($scope.dateFrom.getMonth() + 1));	//+ 1 Month
			console.log($scope.dateFrom);
			console.log($scope.dateTo);

			$scope.dateDisplayFormat = 'dd-MMMM-yyyy';

			for (var i = new Date($scope.dateFrom); i < $scope.dateTo; i.setDate(i.getDate() + 1)) {
				$scope.dates.push({
					weekDay: days[i.getDay()],
					dayNumber: i.getDate()
				});
			}

			// $scope.basicGroups = [];

			 var weekdays = ['Вс', 'Пн', 'Вт', 'Ср' , 'Чт', 'Пт', 'Сб'];
			
			 $http.get('/students').then(function(response) {
			 	$scope.students = response.data;
			 	//var types = ['В', 'Б', 'M', '-', '-'];
			 	var classTypes = ['intro', 'basic', 'young'];

				 var types = [{
					 type: 'Базовый',
					 displayName: 'Б'
				 }, {
					 type: 'Вводный',
					 displayName: 'В'
				 }, {
					 type: 'Молодёжная группа',
					 displayName: 'М'
				 }];

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
								 return e.getTime() === i.getTime();
							 });
							 if (isLesson) {
								 student.visits[k] = {
									 type: _.find(types, {type: isLesson.type}).displayName
								 }
							 } else {
								 student.visits[k] = {
									type: '-'
								 }
							 }
							k++;
					 	}
					 });
				 }, function(err) {
					 console.log(err);
				 });
			// 	var visits1 = [];
			// 	var visits2 = [];

			// 	for (var i = 0; i < 31; i++) {
			// 		var type = Math.floor(Math.random()*5);
			// 		var type2 = Math.floor(Math.random()*5);;
			// 		visits1.push({
			// 			type: types[type],
			// 			typeClass: classTypes[type]
			// 		});
			// 		visits2.push({
			// 			type: types[type2],
			// 			typeClass: classTypes[type2]
			// 		});
			// 	}

			// 	$scope.students[0].visits = visits1;
			// 	$scope.students[1].visits = visits2;

			// 	console.log($scope.students);

			 }, function(err) {
			 	console.log(err);
			 });

			// $http.get('/basicgroups').then(function(response) {
			// 	$scope.basicGroups = response.data;
			// }, function(err) {
			// 	console.log(err);
			// });

			// $scope.dates = [];
			// for (var i = 0; i < 31; i++) {
			// 	$scope.dates.push({
			// 		dayNumber: i+1,
			// 		weekday: weekdays[i % 7]
			// 	});
			// }

			$scope.toggleFromDataPicker = function() {
				$scope.fromOpen = !$scope.fromOpen;
			};
			$scope.toggleToDataPicker = function() {
				$scope.toOpen = !$scope.toOpen;
			};

		});
})(angular);