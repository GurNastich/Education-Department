(function(angular) {
	'use strict';

	angular.module('eventsModule')
		.controller('eventsController', function($scope, $http) {
			$scope.options = {
				columnDefs: [
					{ field: 'name', name: 'Название' },
					{ field: 'type', name: 'Тип' },
					{ field: 'date', name: 'Дата' }
				],
				data: [
					{name: 'Каббала и здоровье', type: 'Базовый', date: Date.now()},
					{name: 'Работа в группе', type: 'Мол. группа', date: Date.now()},
					{name: 'Птиха п.160-163', type: 'Каб. клуб', date: Date.now()}
				]
			};
		});
})(angular);