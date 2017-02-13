(function(){
  'use strict';
  /**
   * @ngdoc overview
   * @name com.module.search
   * @modules
   * @description
   * @requires loopbackApp
   *
   * The `com.modules.core` modules provides services for interacting with
   * the models exposed by the LoopBack server via the REST API.
   *
   */
  angular.module('com.module.search')
    .config(function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('ra-mobile.search', {
          url: '/search',
          resolve: {
            ctx: function(AuthService){
              return AuthService.getCurrent();
            }
          },
          templateUrl: 'modules/search/views/search.html',
          controller: 'SearchCtrl'
        })
      .state('ra-mobile.monthly-searchresults', {
        url:'/monthly?yr&mo',
       resolve:{
          ctx: function(AuthService){
            return AuthService.getCurrent();
          }
       },
        templateUrl: 'modules/search/views/results.html',
        controller: 'MonthlyResultsCtrl'
      })
        .state('ra-mobile.quarterly-searchresults', {
          url:'/quarterly?yr&qtr',
          resolve:{
            ctx: function(AuthService){
              return AuthService.getCurrent();
            }
          },
          templateUrl: 'modules/search/views/results.html',
          controller: 'QtlyResultsCtrl'
        })
        .state('ra-mobile.employee-searchresults', {
          url:'/employee?yr&id',
          resolve:{
            ctx: function(AuthService){
              return AuthService.getCurrent();
            }
          },
          templateUrl: 'modules/search/views/results.html',
          controller: 'EmployeeResultsCtrl'
        })
    })
})();
