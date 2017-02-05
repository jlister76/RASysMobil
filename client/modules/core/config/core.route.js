(function(){
  'use strict';

  angular
    .module('com.module.core')
    .config(function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('auth', {
          url: '/auth',
          template: '<div style="background-color:#000; height: 100%"></div>',
          controller: 'AuthCtrl'
        })
        .state('location-error', {
          url: '/location-error',
          templateUrl: 'modules/core/views/location-error.html',
          controller: 'MainCtrl'
        })
        .state('device-error', {
          url: '/device-error',
          template: '<div layout="column" layout-align="center center" style="height:100vh;"><span></span><span class="md-headline">MOBILE ACCESS ONLY</span>'+
          '<span><i class="material-icons" style="color:indianred; font-size: 6rem;">block</i></span><span class="md-subhead">Please use a <strong>IOS</strong> or <strong>Android</strong> mobile device.</span></div>'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'modules/core/views/login.html',
          controller: 'LogInCtrl'
        })
        .state('logout', {
          url: '/logout',
          controller: 'LogOutCtrl'
        })
        .state('ra-mobile', {
          abstract: true,
          url: '/m/risk-assessment',
          templateUrl: 'modules/core/views/toolbar.html',
          controller: 'ToolBarCtrl'

        })
        .state('ra-mobile.main', {
          url: '',
          resolve: {
            ctx: function(AuthService){
              return AuthService.getCurrent();
            }
          },
          templateUrl: 'modules/core/views/main.html',
          controller: 'MainCtrl'
        });
      $urlRouterProvider.otherwise('/auth');

    })
})();
