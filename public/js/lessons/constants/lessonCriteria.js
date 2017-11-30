(function(angular) {
	'use strict';

    angular.module('lessonsModule')
      .constant('lessonCriteria', {
        criteria: [{
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
            }]
      })
})(angular);