(function(angular) {
	'use strict';

	angular.module('app')
		.controller('loaderController', function($scope, $rootScope) {
			$rootScope.$on('showLoader', function(event, text) {
				$scope.showLoader = true;
				$scope.loaderText = text || 'Обработка команды';
			});
			$rootScope.$on('hideLoader', function(event, text) {
				$scope.showLoader = false;
				$scope.loaderText = '';
			});
		});
})(angular);