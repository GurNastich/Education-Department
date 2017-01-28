(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http) {
			$scope.students = [];
			$scope.basicGroups = [];

			var weekdays = ['Вс', 'Пн', 'Вт', 'Ср' , 'Чт', 'Пт', 'Сб'];
			
			$http.get('/students').then(function(response) {
				$scope.students = response.data;
				var types = ['В', 'Б', 'M', '-', '-'];
				var classTypes = ['intro', 'basic', 'young'];
				
				var visits1 = [];
				var visits2 = [];

				for (var i = 0; i < 31; i++) {
					var type = Math.floor(Math.random()*5);
					var type2 = Math.floor(Math.random()*5);;
					visits1.push({
						type: types[type],
						typeClass: classTypes[type]
					});
					visits2.push({
						type: types[type2],
						typeClass: classTypes[type2]
					});
				}

				$scope.students[0].visits = visits1;
				$scope.students[1].visits = visits2;

				console.log($scope.students);

			}, function(err) {
				console.log(err);
			});

			$http.get('/basicgroups').then(function(response) {
				$scope.basicGroups = response.data;
			}, function(err) {
				console.log(err);
			});

			$scope.dates = [];
			for (var i = 0; i < 31; i++) {
				$scope.dates.push({
					dayNumber: i+1,
					weekday: weekdays[i % 7]
				});
			}

		});
})(angular);