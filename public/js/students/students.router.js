'use strict';

angular.module('studentsModule').config(function($stateProvider) {
	$stateProvider
		.state('new-student', {
			url: '/new-student',
			templateUrl: 'js/students/views/newStudentForm.html',
			controller: 'studentsController'
		})
}); 