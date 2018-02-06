(function(angular) {
	'use strict';

	angular.module('studentsModule')
		.controller('studentFormController', function($scope, $http, $state, $stateParams, $rootScope, notificationService) {

			$scope.phoneError = [];
			$scope.emailError = [];
			$scope.FIO = '';

			var checkGroup = function () {
                if ($scope.student.transitions.toMainGroup) {
                    $scope.student.group = {
                        groupType: 'main',
                        name: 'Основная группа'
                    }
                } else if ($scope.student.transitions.toYoungGroup) {
                    $scope.student.group = {
                        groupType: 'young',
                        name: 'Молодёжная группа'
                    }
                } else if ($scope.student.transitions.toBaseGroup) {
                    $scope.student.group = {
                        groupType: 'base',
                        name: 'Базовый'
                    }
                } else if ($scope.student.transitions.toIntroGroup) {
                    $scope.student.group = {
                        groupType: 'intro',
                        name: 'Вводный'
                    }
                } else if ($scope.student.introLectionDate) {
                    $scope.student.group = {
                        groupType: 'prestudent',
                        name: 'Престьюдент'
                    }
                }
            };

            $scope.isDatePopupOpen = false;

            $scope.openDatePopup = function() {
                $scope.isDatePopupOpen =! $scope.isDatePopupOpen
            };
			
			$http.get('grouptypes').then(function(resp) {
				$scope.groupTypes = resp.data;
			}, function(err) {
				console.log(err);
			});
      
      if ($state.params.id) {
				$rootScope.$broadcast('showLoader', 'Загрузка студента');
				$http.get('student', {params:{id: $state.params.id}}).then(function(resp) {
					$rootScope.$broadcast('hideLoader');
					$scope.student = resp.data[0];
					$scope.student.introLectionDate = new Date($scope.student.introLectionDate);
					if ($scope.student.transitions) {
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

		 				//set student group according last filled date of transition
                        checkGroup();
		 			}
					var patronymic = $scope.student.patronymic ? $scope.student.patronymic : '';
					$scope.FIO = $scope.student.lastName + ' ' + $scope.student.name + ' ' + patronymic;
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
					transitions: {
						toIntroGroup: null,
						toBaseGroup: null,
						toYoungGroup: null,
						toMainGroup: null
					}
				};
			}


      $scope.saveUser = function(student) {
        //map FIO to name, lastname and patronymic
        var validationError = false;

        var FIOArray = $scope.FIO.split(' ');

        if (!$scope.newStudent.FIO.$viewValue || FIOArray.length < 2) {	//empty or only name(lastname required)
          $scope.FIOError = true;
          validationError = true;
        }

        if (student.phones.length > 1 && !student.phones[student.phones.length - 1]) {
          $scope.phoneError[student.phones.length - 1] = true;
          return;
        }

        if (validationError) {
          return;
        }

        //map name, last name and patronymic
        student.lastName = FIOArray[0];
        student.name = FIOArray[1];
				student.patronymic = FIOArray[2] ? FIOArray[2] : '';
				
				if (!student.introLectionDate && !student.transitions.toBaseGroup && !student.transitions.toIntroGroup && !student.transitions.toYoungGroup && !student.transitions.toMainGroup) {
					delete student.group;
				}

        // if (student.group) {
        //   student.group = {
        //     groupType: student.group.groupType,
        //     name: _.find($scope.groupTypes, {type: student.group.groupType}).name
        //   }
        // }

		  checkGroup();
        $rootScope.$broadcast('showLoader', 'Сохранение студента в базу данных');
        if (student._id) {
          // var group = JSON.parse(student.group);
          $http.put('student', {student:student}).then(function(resp) {
            $rootScope.$broadcast('hideLoader');
            $state.go('students');
          }, function(err) {
            $rootScope.$broadcast('hideLoader');
            console.log(err)
          });
        } else {
          $http.post('student', {student: student}).then(function(resp) {
            $rootScope.$broadcast('hideLoader');
            $state.go('students');
          }, function(err) {
            $rootScope.$broadcast('hideLoader');
            console.log(err);
          });
        }
      };

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
			};

			$scope.checkEmptyFIO = function(val) {
				$scope.FIOError = !val;
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
    });
  })(angular);