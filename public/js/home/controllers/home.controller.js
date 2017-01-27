(function(angular) {
	'use strict';

	angular.module('homeModule')
		.controller('homeController', function($scope, $http) {
			var students = [];

			console.log('get students');
			
			// $http.get('/students').then(function(response) {
			// 	console.log(response);
			// }, function(err) {
			// 	console.log(err);
			// });


		});
})(angular);