'use strict';

angular.module('studentsModule').config(function($stateProvider) {
	$stateProvider
		.state('students', {
			url: '/students',
			templateUrl: 'js/students/views/students.html',
			controller: 'studentsController'
		})
}); 