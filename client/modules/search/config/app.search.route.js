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
    })
})();
