(function(){
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:AuthCtrl
   * @description Redirect for access
   * @requires $q
   * @requires $scope
   * @requires $state
   * @requires $location
   * @requires AppAuth
   **/
  angular
    .module('com.module.core')
    .controller('AuthCtrl', function (AuthService, deviceDetector, $location) {
       console.log("In AuthCtrl");

        //TODO: Uncomment for production use
      /*if (deviceDetector.os !== 'ios' || deviceDetector.os !== 'android'){
        //Allows IOS or Android devices only
        $location.path('/device-error');
      }else if (AuthService.getCurrent) {
        /!*
        * Ensure authentication:
        * If unauthenticated AuthService.getCurrent returns a 401 error,
        * and is handled by the global handler in the config block.
        *!/
        $location.path('/mobile-risk-assessment');
        $rootScope.currentUser = AuthService.getCurrent();
      }*/
      if (AuthService.getCurrent) {
      /*
      * Ensure authentication:
      * If unauthenticated AuthService.getCurrent returns a 401 error,
      * and is handled by the global handler in the config block.
      */

        console.log("Authentication passed.");
        $location.path('/m/risk-assessment');
        //$state.go('ra-mobile.main');
        //$state.go('ra-mobile');
        /*$state.transitionTo($state.current, $stateParams, {
         reload: true, inherit: false, notify: true
         });*/

      }



    })
    .controller('LogInCtrl', function(AuthService, deviceDetector, $scope, $location){
      //TODO: Uncomment for production use
      /*if (deviceDetector.os !== 'ios' || deviceDetector.os !== 'android') {
        //Allows IOS or Android devices only
        $location.path('/device-error');
      } else {
        $scope.login = function(email,password){
          AuthService.login(email,password)
            .$promise
            .then(function(){
              console.log("Log-in successful.");
              var next = $location.nextAfterLogin || '/';
              $location.nextAfterLogin = null;
              $location.path(next);
              $location.path('/mobile-risk-assessment');
              //$state.go('ra-mobile.main');
              $rootScope.currentUser;

            })
            .catch(function(e){
              if (e) {
                console.log(e);
                $scope.err = e;

              }
            })
        };
      }*/
      $scope.login = function(email,password){
        AuthService.login(email,password)
          .$promise
          .then(function(){
            console.log("Log-in successful.");
            var next = $location.nextAfterLogin || '/';
            $location.nextAfterLogin = null;
            $location.path(next);
            $location.path('/m/risk-assessment');
          })
          .catch(function(e){
            if (e) {
              console.log(e);
              $scope.err = e;

            }
          })
          .then(function(){

          })
      };

    })
    .controller('LogOutCtrl', function(AuthService, $scope, $state){
      $scope.logout = function () {
        console.log('Signing out...');
        AuthService.logout()
          .$promise
          .then(function(){
            $state.go('login');
            sessionStorage.clear();
          });
      };
    })
    .controller('MainCtrl', function(AuthService, $scope, $state, $mdSidenav){
        console.log("In main ctrl");
        var type,groupId;

      $scope.isSidenavOpen = false;

      $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
      };

      AuthService.getCurrent()
        .$promise
        .then(function(ctx){
          type = ctx.accessLevelType;
          groupId = ctx.accessLevelGroupId;

          $scope.stateChange = function(){
            console.log("Start",type);
            $state.go('ra-mobile.new.assessment');
          };

        })
        .catch(function(err){
          console.error(err);
        });
    })
    .controller('ToolBarCtrl', function($scope,$mdSidenav){
      $scope.isSidenavOpen = false;
      $scope.msg ="Not seeing it";
      $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          $scope.$apply(function(){
            $scope.location = position;
            console.log(position.coords);
          });
        });
      }


    })
})();
