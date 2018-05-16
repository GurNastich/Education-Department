(function(angular) {
	'use strict';

	angular.module('lessonsModule')
		.controller('lessonFormController', function($scope, $http, $state, $rootScope, $timeout, lessonMaterials, lessonCriteria, EduLists) {

			$scope.openDatePopup = function() {
				$scope.isDatePopupOpen =! $scope.isDatePopupOpen
			};

			$scope.setStudentsCount = function(selected) {
				$scope.lesson.studentsCount = selected ? $scope.lesson.studentsCount+=1 : $scope.lesson.studentsCount-=1;
			};

			$scope.setGuestsCount = function(selected) {
				$scope.lesson.guestsCount = selected ? $scope.lesson.guestsCount+=1 : $scope.lesson.guestsCount-=1;
			};
			
			$scope.validateName = function(val) {
				$scope.nameError = !val;
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
				if (!$scope.lesson.type) {
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

				var teachers = _.map(lesson.teachers, 'name');
				var admin = lesson.admin ? lesson.admin.name : "";

				//save teachers and admin
				$http.post('stuff',{teachers : teachers, admin : admin});

				lesson.students = _.filter($scope.students, {visit: true});
				lesson.students = _.map(lesson.students, function(s) {
					return {
						id: s.id,
						name: s.name,
						lastName: s.lastName
					}
				});
				
				//Map from select control
				lesson.type = lesson.type.name;
				lesson.teachers[0] = lesson.teachers[0] ? lesson.teachers[0].name : '';
				lesson.teachers[1] = lesson.teachers[1] ? lesson.teachers[1].name : '';
				lesson.admin = lesson.admin.name;

				lesson.materials = _.filter(lesson.materials, {selected: true});
				$rootScope.$broadcast('showLoader', 'Сохранение урока');
				
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
		
			$scope.getStudents = function() {
				 return $http.get('students').then(function(resp) {
					var students = _.map(resp.data, function(stud) {
						return {
							id: stud._id,
							name: stud.name,
							lastName: stud.lastName,
							type: stud.type
						}
					});
					return students;
				}, function(err) {
					console.log(err);
				});
			};

			$scope.selectType = function() {
				$scope.typeError = false;
			};

			$scope.addStudent = function() {
				var newStudent = $scope.lesson.newStudent;

				if (_.find($scope.lesson.students, {id: newStudent.id})) {
					$scope.errorText = "Студент уже присутствует в списке студентов данного урока";
					$scope.showAddStudentError = true;
					$timeout(function() {
						$scope.showAddStudentError = false;
					}, 5000);
					return;
				}

				$scope.lesson.students.push({id: newStudent.id, name: newStudent.name, lastName: newStudent.lastName, visit: true});
				$scope.lesson.newStudent = '';
			};

			$scope.getAdmin = function(search) {
				if (!$scope.admins) {
					return;
				}

				var newAdmins = $scope.admins;
				if (search && !_.find(newAdmins, {name: search})) {
					newAdmins.shift();
					newAdmins.unshift({name: search});
				}
				return newAdmins;
			};

			$scope.getTeacher = function(search) {
				if (!$scope.teachers) {
					return;
				}

				var newTeachers = $scope.teachers;
				if (search && !_.find(newTeachers, {name: search})) {
					newTeachers.shift();
					newTeachers.unshift({name: search});
				}
				return newTeachers;
			};
			
			function init() {

				$scope.isDatePopupOpen = false;
				
				EduLists.getLessonTypes().then(function(resp) {
					$scope.types = resp;
				});

				$scope.getStudents().then(function(resp) {
					$scope.students = resp;
					if ($scope.lesson.isNew) {
						$scope.lesson.students = resp;
					}
				});

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
						
						//map lesson and response
						$scope.lesson = resp.data[0];
						$scope.lesson.isNew = false;
						$scope.lesson.date = new Date($scope.lesson.date);

						//Init selects
						$scope.lesson.type = _.find($scope.types, {name: $scope.lesson.type});
						$scope.lesson.teachers[0] = _.find($scope.teachers, {name: $scope.lesson.teachers[0]});
						$scope.lesson.teachers[1] = _.find($scope.teachers, {name: $scope.lesson.teachers[1]});
						$scope.lesson.admin = _.find($scope.admins, {name: $scope.lesson.admin});


						_.each($scope.lesson.students, function(student) {
							student.visit = true;
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
						materials: lessonMaterials.materials,
						criteria: lessonCriteria.criteria,
						studentsCount: 0,
						guestsCount: 0,
						isNew: true
					};
				}
			}

			init();

		})
})(angular);