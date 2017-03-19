(function(angular) {
	'use strict';

	angular.module('lessonsModule')
		.controller('lessonsController', function($scope, $http, $state) {
			function getStudents(types) {
				// var type = 'base';
				 return $http.get('/students').then(function(resp) {
				// $http.get('/students').then(function(resp) {
					var students = _.map(resp.data, function(stud) {
						return {
							id: stud._id,
							name: stud.name,
							lastName: stud.lastName
						}
					});
					return students;
				}, function(err) {
					console.log(err);
				});
			}

			if($state.params.id) {
				$http.get('/lesson', {params:{id: $state.params.id}}).then(function(resp) {
					$scope.lesson = resp.data[0];
					$scope.lesson.date = new Date($scope.lesson.date);
					$scope.students = [];
					$scope.lesson.groups = _.map($scope.lesson.groups, function(g) {
						return g.groupType;
					});
					// _.each($scope.lesson.groups, function(group) {
						getStudents($scope.lesson.groups).then(function(studs) {
							_.each(studs, function(s) {
								s.visit = _.findIndex($scope.lesson.students, {id: s.id}) > -1 ? true : false;
							});
							$scope.students = studs;
						});
					// });

					// $scope.lesson.groups = ['base'];
				}, function(err) {
					console.log(err);
				});
			} else {
				$scope.lesson = {
					teachers: []
				};
				$scope.students = [];
			}
			// $scope.students = [];
			// var type = 'base';
			// //$http.get('/students', {params:{type: type}}).then(function(resp) {
			// $http.get('/students').then(function(resp) {
			// 	$scope.students = resp.data;
			// }, function(err) {
			// 	console.log(err);
			// });

			$http.get('/grouptypes').then(function(resp) {
				$scope.types = resp.data;
			}, function(err) {
				console.log(err);
			});

			$http.get('/lessons').then(function(resp) {
				$scope.lessons = resp.data;
				_.each($scope.lessons, function(lesson) {
					lesson.date = new Date(lesson.date).toLocaleString('ru', {day: 'numeric', month: 'short', year: 'numeric'});
				});
			}, function(err) {
				console.log(err);
			});

			$scope.validateName = function(val) {
				$scope.nameError = !val;
			};
			$scope.validateType = function(vals) {
				$scope.typeError = vals.length === 0;
				getStudents(vals).then(function(studs) {
					_.each(studs, function(s) {
						s.visit = _.findIndex($scope.lesson.students, {id: s.id}) > -1 ? true : false;
					});
					$scope.students = studs;
				});
			};
			$scope.validateDate = function(val) {
				$scope.dateError = !val;
			};

			$scope.saveLesson = function(lesson) {
				var validationError = false;

				if (!$scope.newLessonForm.name.$viewValue) {
					$scope.nameError = true;
					validationError = true;
				}
				if (!$scope.newLessonForm.type.$viewValue) {
					$scope.typeError = true;
					validationError = true;
				}
				if (!$scope.newLessonForm.date.$viewValue) {
					$scope.dateError = true;
					validationError = true;
				}

				if (validationError) {
					return;
				}

				lesson.students = _.filter($scope.students, {visit: true});
				//save only objectId, name and lastname
				lesson.students = _.map(lesson.students, function(s) {
					return {
						id: s.id,
						name: s.name,
						lastName: s.lastName
					}
				});
				lesson.groups = _.map(lesson.groups, function(group) {
					return {
						groupType: group,
						name: _.find($scope.types, {type: group}).name
					}
				});

				if (lesson._id) {
					$http.put('/lesson', {lesson: lesson}).then(function(resp) {
						$state.go('lessons');
					}, function(err) {
						console.log(err);
					});
				} else {
					$http.post('/lesson', {lesson: lesson}).then(function(resp) {
						$state.go('lessons');
					}, function(err) {
						console.log(err);
					});
				}
			};

			$scope.openLesson = function(lesson) {
				$state.go('lesson', {id: lesson._id});
			}
		});
})(angular);