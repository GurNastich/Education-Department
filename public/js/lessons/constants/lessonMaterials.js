(function(angular) {
	'use strict';

    angular.module('lessonsModule')
      .constant('lessonMaterials', {
        materials: [{
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
        }]
      })
})(angular);