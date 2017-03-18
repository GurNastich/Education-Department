'use strict';

angular.module('lessonsModule').config(function($stateProvider) {
	$stateProvider
		.state('new-lesson', {
			url: '/new-lesson',
			templateUrl: 'js/lessons/views/newLessonForm.html',
			controller: 'lessonsController'
		})
		.state('lessons', {
			url: '/lessons',
			templateUrl: 'js/lessons/views/lessonList.html',
			controller: 'lessonsController'
		})
		.state('lesson', {
			url: '/lessons/:id',
			templateUrl: 'js/lessons/views/newLessonForm.html',
			controller: 'lessonsController'
		});
});