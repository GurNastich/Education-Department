'use strict';

angular.module('studentsModule').config(function($stateProvider) {
	$stateProvider
		.state('students', {
			url: '/students',
			templateUrl: 'js/students/views/studentList.html',
			controller: 'studentsController'
		})
		.state('new-student', {
			url: '/new-student',
			templateUrl: 'js/students/views/studentForm.html',
			controller: 'studentFormController'
		})
		.state('student', {
			url: '/student/:id',
			templateUrl: 'js/students/views/studentForm.html',
			controller: 'studentFormController'
		});
}); 