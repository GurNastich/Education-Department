(function(angular) {
	'use strict';

	angular.module('studentsModule')
		.controller('studentsController', function($scope) {
			$scope.students = [{name: 'ol'}, {name: 'al'}];
		});
})(angular);