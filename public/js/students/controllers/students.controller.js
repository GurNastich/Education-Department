(function(angular) {
	'use strict';

	angular.module('studentsModule')
		.controller('studentsController', function($scope, $http) {
			$scope.student = {
				phones: [''],
				emails: [''],
				profileLinks: [{
					linkType: '',
					linkName: ''
				}]
			};

			$scope.saveUser = function(student) {
				console.log('Save student to the DB');
				$http.post('/saveUser', {student: student}).then(function(resp) {
					console.log(resp);
				}, function(err) {
					console.log(err);
				});
			};
		});
})(angular);