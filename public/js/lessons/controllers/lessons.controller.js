(function(angular) {
	'use strict';

	angular.module('lessonsModule')
		.controller('lessonsController', function($scope, $http, $state, $rootScope) {
			var materials = [{
					id: 'clips',
					name: 'клипы',
					selected: false
				}, {
					id: 'read_teachers',
					name: 'книги (читали преподаватели)',
					selected: false
				}, {
					id: 'read_together',
					name: 'книги (читали вместе со студентами)',
					selected: false
				}, {
					id: 'desk',
					name: 'чертежи и записи на доске',
					selected: false
				}, {
					id: 'workshop',
					name: 'семинар',
					selected: false
			}];	

			var criteria = [{
					id: 'preparation',
					name: 'подготовка аудитории (книги, парты, блокноты, маркеры, ...)',
					value: ''
				}, {
					id: 'teachers_interaction',
					name: 'взаимодействие преподавателей',
					value: ''
				}, {
					id: 'appearance',
					name: 'внешний вид преподавателей',
					value: ''
				}, {
					id: 'attitude',
					name: 'отношение к студентам',
					value: ''
				}, {
					id: 'clarity',
					name: 'ясность донесения материала',
					value: ''
				}, {
					id: 'mood',
					name: 'настроение аудитории',
					value: ''
				}, {
					id: 'overall_value',
					name: 'общая оценка урока',
					value: ''
				}];

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

			if ($state.params.id) {
				$rootScope.$broadcast('showLoader', 'Загрузка урока');
				$http.get('/lesson', {params:{id: $state.params.id}}).then(function(resp) {
					$rootScope.$broadcast('hideLoader');
					$scope.lesson = resp.data[0];
					$scope.lesson.date = new Date($scope.lesson.date);
					$scope.students = [];
					$scope.lesson.groups = _.map($scope.lesson.groups, function(g) {
						return g.groupType;
					});
						getStudents($scope.lesson.groups).then(function(studs) {
							_.each(studs, function(s) {
								s.visit = _.findIndex($scope.lesson.students, {id: s.id}) > -1 ? true : false;
							});
							$scope.students = studs;
						});

					_.each(materials, function(m) {
						m.selected = _.find(resp.data[0].materials, {id: m.id}) ? true : false;
					});

					$scope.lesson.materials = materials;
					$scope.lesson.criteria = $scope.lesson.criteria && $scope.lesson.criteria.length !== 0 ? $scope.lesson.criteria : criteria;
					$scope.lesson.date = moment($scope.lesson.date.toLocaleString()).format('D-MMM-YYYY');

					$scope.lesson.studentsCount = resp.data[0].studentsCount ? resp.data[0].studentsCount : $scope.lesson.students.length;
					$scope.lesson.guestsCount = resp.data[0].guestsCount ? resp.data[0].guestsCount : 0;

				}, function(err) {
					console.log(err);
				});
			} else {
				$scope.lesson = {
					teachers: [],
					groups: [],
					materials: materials,
					criteria: criteria,
					studentsCount: 0,
					guestsCount: 0
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

			$rootScope.$broadcast('showLoader', 'Загрузка уроков');
			$http.get('/lessons').then(function(resp) {
				$scope.lessons = resp.data;
				_.each($scope.lessons, function(lesson) {
					lesson.date = new Date(lesson.date).toLocaleString('ru', {day: 'numeric', month: 'short', year: 'numeric'});
				});
				$rootScope.$broadcast('hideLoader');
			}, function(err) {
				$rootScope.$broadcast('hideLoader');
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
				lesson.materials = _.filter(lesson.materials, {selected: true});
				$rootScope.$broadcast('showLoader', 'Сохранение урока');
				if (lesson._id) {
					$http.put('/lesson', {lesson: lesson}).then(function(resp) {
						$rootScope.$broadcast('hideLoader');
						$state.go('lessons');
					}, function(err) {
						$rootScope.$broadcast('hideLoader');
						console.log(err);
					});
				} else {
					$http.post('/lesson', {lesson: lesson}).then(function(resp) {
						$rootScope.$broadcast('hideLoader');
						$state.go('lessons');
					}, function(err) {
						$rootScope.$broadcast('hideLoader');
						console.log(err);
					});
				}
			};

			$scope.openLesson = function(lesson) {
				$state.go('lesson', {id: lesson._id});
			};

			$scope.removeLesson = function(lesson) {
				$rootScope.$broadcast('showLoader', 'Удаление урока из базы данных');
				$http.delete('/lesson', {params:{id: lesson._id}}).then(function(resp) {
					$scope.lessons = resp.data;
					_.each($scope.lessons, function(lesson) {
						lesson.date = new Date(lesson.date).toLocaleString('ru', {day: 'numeric', month: 'short', year: 'numeric'});
					});
					$rootScope.$broadcast('hideLoader');
				}, function(err) {
					$rootScope.$broadcast('hideLoader');
					console.log(err);
				});
			};
		
			$scope.showNewStudent = false;

			$scope.addNewStudent = function() {
				$scope.addNewStudent = '';
				$scope.showNewStudent = false;
			};

			$scope.isDatePopupOpen = false;

			$scope.openDatePopup = function() {
				$scope.isDatePopupOpen =! $scope.isDatePopupOpen
			};

			$scope.setStudentsCount = function(selected) {
				$scope.lesson.studentsCount = selected ? $scope.lesson.studentsCount+=1 : $scope.lesson.studentsCount-=1;
			};

			$scope.setGuestsCount = function(selected) {
				$scope.lesson.guestsCount = selected ? $scope.lesson.guestsCount+=1 : $scope.lesson.guestsCount-=1;
			};
		});
})(angular);