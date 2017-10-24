'use strict';

angular.module('studentsModule').config(function($stateProvider) {
	$stateProvider
		.state('new-student', {
			url: '/new-student',
			templateUrl: 'js/students/views/newStudentForm.html',
			controller: 'studentsController'
		})
		.state('students', {
			url: '/students',
			templateUrl: 'js/students/views/studentList.html',
			controller: 'studentsController'
		})
		.state('student', {
			url: '/student/:id',
			templateUrl: 'js/students/views/newStudentForm.html',
			controller: 'studentsController'
		});
}); 