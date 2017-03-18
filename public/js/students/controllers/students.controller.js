(function(angular) {
	'use strict';

	angular.module('studentsModule')
		.controller('studentsController', function($scope, $http, $state, $stateParams) {
			$scope.students = [];
			$scope.phoneError = [];
			$scope.emailError = [];

			$http.get('/grouptypes').then(function(resp) {
				$scope.groupTypes = resp.data;
			}, function(err) {
				console.log(err);
			});

			$http.get('/students').then(function(resp) {
				$scope.students = resp.data;
			}, function(err) {
				console.log(err);
			});

			if ($state.params.id){
				$http.get('/student', {params:{id: $state.params.id}}).then(function(resp) {
					$scope.student = resp.data[0];
					$scope.student.introLectionDate = new Date($scope.student.introLectionDate);
					if ($scope.student.transitions.toBaseGroup) {
						$scope.student.transitions.toBaseGroup = new Date($scope.student.transitions.toBaseGroup);
					}
					if ($scope.student.transitions.toIntroGroup) {
						$scope.student.transitions.toIntroGroup = new Date($scope.student.transitions.toIntroGroup);
					}
					if ($scope.student.transitions.toYoungGroup) {
						$scope.student.transitions.toYoungGroup = new Date($scope.student.transitions.toYoungGroup);
					}
					if ($scope.student.transitions.toMainGroup) {
						$scope.student.transitions.toMainGroup = new Date($scope.student.transitions.toMainGroup);
					}
					$scope.student.transition = new Date($scope.student.introLectionDate);
				}, function(err) {
					console.log(err);
				});
			} else {	//new student
				$scope.student = {
					phones: [''],
					emails: [''],
					profileLinks: [{
						linkType: 'VK',
						linkName: ''
					}, {
						linkType: 'FB',
						linkName: ''
					}],
					transitions: {}
				};
			}
			$scope.addPhone = function(student) {
				var empty = student.phones[student.phones.length - 1] === undefined ||
							student.phones[student.phones.length - 1] === '' ||
							student.phones[student.phones.length - 1] === null;
				if (empty) {
					$scope.phoneError[student.phones.length - 1] = true;
					return;
				}

				student.phones.push('');
			};

			$scope.addEmail = function(student) {
				var empty = student.emails[student.emails.length - 1] === undefined ||
							student.emails[student.emails.length - 1] === '' ||
							student.emails[student.emails.length - 1] === null;
				if (empty) {
					$scope.emailError[student.emails.length - 1] = true;
					return;
				}

				student.emails.push('');
			}

			$scope.validateLastNameField = function(val) {
				$scope.lastNameError = !val;
			};

			$scope.validateNameField = function(val) {
				$scope.nameError = !val;
			};

			var phonePattern = /[\d()-]+/;

			$scope.validatePhone = function(val, index) {
				val[index] = phonePattern.exec(val[index]); 
				if (!val[index]) {
					$scope.phoneError[index] = true;
					return;	
				}
				$scope.phoneError[index] = false;
			};

			$scope.validateEmail = function(val, index) {
				$scope.emailError[index] = false;
			};

			$scope.removeItem = function(array, index) {
				array.splice(index, 1);
			};

			$scope.saveUser = function(student) {
				var validationError = false;
				if (!$scope.newStudent.lastName.$viewValue) {
					$scope.lastNameError = true;
					validationError = true;
				}
				if (!$scope.newStudent.name.$viewValue) {
					$scope.nameError = true;
					validationError = true;
				}

				if (student.phones.length > 1 && !student.phones[student.phones.length - 1]) {
					$scope.phoneError[student.phones.length - 1] = true;
					return;
				}

				if (validationError) {
					return;
				}

				if (student.group) {
					student.group = {
						groupType: student.group.groupType,
						name: _.find($scope.groupTypes, {type: student.group.groupType}).name
					}
				}
				if (student._id) {
					// var group = JSON.parse(student.group);
					$http.put('/student', {student:student}).then(function(resp) {
						$state.go('students');	
					}, function(err) {
						console.log(err)
					});
				} else {
					$http.post('/saveUser', {student: student}).then(function(resp) {
						$state.go('students');
					}, function(err) {
						console.log(err);
					});
				}
			};

			$scope.openStudent = function(student) {
				$state.go('student', {id: student._id});
			};
		});
})(angular);