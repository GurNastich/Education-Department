(function(angular) {
	'use strict';

	angular.module('app')
		.factory('EduLists', function($http, $q) {
			var lessonTypes, studentTypes;

			function getLessonTypes() {
				var deffered = $q.defer();

				if (lessonTypes) {
					deffered.resolve(lessonTypes);
				} else {
					$http.get('lessontypes').then(function(resp) {
						lessonTypes = resp.data;
						deffered.resolve(lessonTypes);
					}, function(err) {
						deffered.reject('Error on exctracting lesson types');
					});
				}

				return deffered.promise;
			}

			function getStudentTypes() {
				var deffered = $q.defer();

				if (studentTypes) {
					deffered.resolve(studentTypes);
				} else {
					$http.get('studenttypes').then(function(resp) {
						studentTypes = _.map(resp.data, 'type');
						deffered.resolve(studentTypes);
					}, function(err) {
						deffered.reject('Error on exctracting student types');
					});
				}

				return deffered.promise;
			}

			return {
				getLessonTypes: getLessonTypes,
				getStudentTypes: getStudentTypes
			}
			
		});
})(angular);