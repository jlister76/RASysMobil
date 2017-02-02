(function(){
  'use strict';

  angular.module('com.module.search')
    .controller('SearchCtrl', function($scope, ctx){
      $scope.user = ctx;
      $scope.months = ["January","Feburary","March","April","May","June","July","August","September","October","November","December"];
    })
})();
