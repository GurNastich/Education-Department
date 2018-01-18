(function(angular) {
	'use strict';

	angular.module('lessonsModule')
		.controller('lessonFormController', function($scope, $http, $state, $rootScope, lessonMaterials, lessonCriteria) {

			$scope.openDatePopup = function() {
				$scope.isDatePopupOpen =! $scope.isDatePopupOpen
			};

			$scope.setStudentsCount = function(selected) {
				$scope.lesson.studentsCount = selected ? $scope.lesson.studentsCount+=1 : $scope.lesson.studentsCount-=1;
			};

			$scope.setGuestsCount = function(selected) {
				$scope.lesson.guestsCount = selected ? $scope.lesson.guestsCount+=1 : $scope.lesson.guestsCount-=1;
			};

			// $scope.addNewStudent = function() {
			// 	$scope.addNewStudent = '';
			// 	$scope.showNewStudent = false;
			// };
			
			$scope.validateName = function(val) {
				$scope.nameError = !val;
			};

			$scope.validateType = function(val) {
				$scope.typeError = false;

				if (!val.selected) {
					_.remove($scope.students, {type: val.type});
					_.remove($scope.lesson.groups, {type: val.type});			
					return;
				}

				$scope.lesson.groups.push(val);

				$scope.showSpin = true;
				$scope.getStudents(val.type).then(function(studs) {
					_.each(studs, function(s) {
						s.visit = _.findIndex($scope.lesson.students, {id: s.id}) > -1 ? true : false;
					});
					$scope.students = $scope.students.concat(studs);
					$scope.showSpin = false;
				});
			};

			$scope.validateDate = function(val) {
				$scope.dateError = !val;
			};

			$scope.saveLesson = function(lesson) {
				var validationError = false;
				var date = moment(lesson.date,'D-MMM-YYYY');
				$scope.lesson.date = date;

				if (!$scope.newLessonForm.name.$viewValue) {
					$scope.nameError = true;
					validationError = true;
				}
				if ($scope.lesson.groups.length === 0) {
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
				lesson.students = _.map(lesson.students, function(s) {
					return {
						id: s.id,
						name: s.name,
						lastName: s.lastName
					}
				});
				lesson.groups = _.map(lesson.groups, function(group) {
					return {
						groupType: group.type,
						name: _.find($scope.types, {type: group.type}).name
					}
				});
				lesson.materials = _.filter(lesson.materials, {selected: true});
				$rootScope.$broadcast('showLoader', 'Сохранение урока');
				
				$http.post('stuff',{teachers : lesson.teachers, admin : lesson.admin});

				if (lesson._id) {
					$http.put('lesson', {lesson: lesson}).then(function(resp) {
						$rootScope.$broadcast('hideLoader');
						$state.go('lessons');
					}, function(err) {
						$rootScope.$broadcast('hideLoader');
						console.log(err);
					});
				} else {
					$http.post('lesson', {lesson: lesson}).then(function(resp) {
						$rootScope.$broadcast('hideLoader');
						$state.go('lessons');
					}, function(err) {
						$rootScope.$broadcast('hideLoader');
						console.log(err);
					});
				}
			};

			$scope.getGroupTypes = function() {
				$http.get('grouptypes').then(function(resp) {
					// var types = [];
					$scope.types = resp.data;
	
					// _.each($scope.types, function(type) {
					// 	if (_.find($scope.lesson.groups, {type: type.type})) {
					// 		type.selected = true;
					// 		types.push(type.type);
					// 	}
					// });
	
					// $scope.getStudents(types).then(function(studs) {
					// 	_.each(studs, function(s) {
					// 		s.visit = _.findIndex($scope.lesson.students, {id: s.id}) > -1 ? true : false;
					// 	});
					// 	$scope.students = studs;
					// });
	
				}, function(err) {
					console.log(err);
				});
			};
		
			$scope.getStudents = function(types) {
				 return $http.get('students', {params:{types: types}}).then(function(resp) {
					var students = _.map(resp.data, function(stud) {
						return {
							id: stud._id,
							name: stud.name,
							lastName: stud.lastName,
							type: stud.group ? stud.group.groupType : 'Неизвестная группа'
						}
					});
					return students;
				}, function(err) {
					console.log(err);
				});
			};
			
			function init() {

				// $scope.showNewStudent = false;
				$scope.isDatePopupOpen = false;

				$scope.getGroupTypes();
				$http.get('stuff/teachers').then(function (resp) {
					$scope.teachers = resp.data;
				});
				
				$http.get('stuff/admins').then(function (resp) {
						$scope.admins = resp.data;
				});
				
				if ($state.params.id) {
					$rootScope.$broadcast('showLoader', 'Загрузка урока');
					$http.get('lesson', {params:{id: $state.params.id}}).then(function(resp) {
						$rootScope.$broadcast('hideLoader');
						$scope.lesson = resp.data[0];
						$scope.lesson.date = new Date($scope.lesson.date);
						$scope.students = [];
						$scope.lesson.groups = _.map($scope.lesson.groups, function(g) {
							return {
								name: g.name,
								type: g.groupType
							}
						});

						var types = [];
						_.each($scope.types, function(type) {
							if (_.find($scope.lesson.groups, {type: type.type})) {
								type.selected = true;
								type.disabled = true;
								types.push(type.type);
							}
						});
	
						$scope.getStudents(types).then(function(studs) {
							_.each(studs, function(s) {
								s.visit = _.findIndex($scope.lesson.students, {id: s.id}) > -1 ? true : false;
							});
							$scope.students = studs;
						});
	
						_.each(lessonMaterials.materials, function(m) {
							m.selected = _.find(resp.data[0].materials, {id: m.id}) ? true : false;
						});
	
						$scope.lesson.materials = lessonMaterials.materials;
						$scope.lesson.criteria = $scope.lesson.criteria && $scope.lesson.criteria.length !== 0 ? $scope.lesson.criteria : lessonCriteria.criteria;
						$scope.lesson.date = moment($scope.lesson.date).format('D-MMM-YYYY');
	
						$scope.lesson.studentsCount = resp.data[0].studentsCount ? resp.data[0].studentsCount : $scope.lesson.students.length;
						$scope.lesson.guestsCount = resp.data[0].guestsCount ? resp.data[0].guestsCount : 0;
	
					}, function(err) {
						console.log(err);
					});
				} else {
					$scope.lesson = {
						teachers: [],
						groups: [],
						materials: lessonMaterials.materials,
						criteria: lessonCriteria.criteria,
						studentsCount: 0,
						guestsCount: 0
					};
					$scope.students = [];
				}
			}

			init();

		})
})(angular);