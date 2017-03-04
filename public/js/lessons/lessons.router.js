'use strict';

angular.module('lessonsModule').config(function($stateProvider) {
	$stateProvider
		.state('new-lesson', {
			url: '/new-lesson',
			templateUrl: 'js/lessons/views/newLessonForm.html',
			controller: 'lessonsController'
		});
});