(function(){
  'use strict';

  angular.module('com.module.search')
    .controller('SearchCtrl', function($scope, ctx){
      $scope.user = ctx;
      $scope.months = [
        {
        "name": "January",
        "number": 0
        },
        {
          "name": "Feburary",
          "number": 1
        },
        {
          "name": "March",
          "number": 2
        },
        {
          "name": "April",
          "number": 3
        },
        {
          "name": "May",
          "number": 4
        },
        {
          "name": "June",
          "number": 5
        },
        {
          "name": "July",
          "number": 6
        },
        {
          "name": "August",
          "number": 7
        },
        {
          "name": "September",
          "number": 8
        },
        {
          "name": "October",
          "number": 9
        },
        {
          "name": "November",
          "number": 10
        },
        {
          "name": "December",
          "number": 11
        }
      ];
      $scope.quarters = [1,2,3,4];

    })
})();
