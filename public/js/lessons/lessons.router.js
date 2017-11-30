'use strict';

angular.module('lessonsModule').config(function($stateProvider) {
	$stateProvider
		.state('new-lesson', {
			url: '/new-lesson',
			templateUrl: 'js/lessons/views/lessonForm.html',
			controller: 'lessonFormController'
		})
		.state('lesson', {
			url: '/lessons/:id',
			templateUrl: 'js/lessons/views/lessonForm.html',
			controller: 'lessonFormController'
		})
		.state('lessons', {
			url: '/lessons',
			templateUrl: 'js/lessons/views/lessons.html',
			controller: 'lessonsController'
		});
});