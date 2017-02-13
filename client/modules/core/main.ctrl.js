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
    .controller('MainCtrl', function(AuthService,$scope,$state,$mdSidenav,Region,Division,Project,Group,MonthlyStatus,RiskAssessment){
        AuthService.getCurrent()
          .$promise
          .then(function(ctx){
            console.log(ctx);
            var type = ctx.accessLevel,
              groupId = ctx.accessLevelAreaId;
            console.log("In main ctrl",type, ctx.id);
            init();
            function init(){
              switch (type) {
                case "Region":
                  console.log(type);
                  getRegion(groupId);
                  getRegionMonthlyStatuses(groupId);
                  break;
                case "Division":
                  $scope.groupType = type;
                  getDivision(groupId);
                  break;
                case "Project":
                  $scope.groupType = type;
                  getProject(groupId);
                  break;
                case "Group":
                  $scope.groupType = type;
                  getGroup(groupId);
                  break;

              }//matches users access type and loads the corresponding data
              function getRegion(id){
                console.log(id);
                Region.findById({id:id})
                  .$promise
                  .then(function(region){
                    $scope.group = region;
                    console.log($scope.group.title);
                  })
                  .catch(function(err){if(err){console.error(err)}})
              };
              function getDivision(id){
                Division.findById({id:id})
                  .$promise
                  .then(function(region){

                  })
                  .catch(function(err){if(err){console.error(err)}})
              };
              function getProject(id){
                Project.findById({id:id})
                  .$promise
                  .then(function(region){

                  })
                  .catch(function(err){if(err){console.error(err)}})
              };
              function getGroup(id){
                Group.findById({id:id})
                  .$promise
                  .then(function(region){

                  })
                  .catch(function(err){if(err){console.error(err)}})
              };
              function getRegionMonthlyStatuses (id){
                return MonthlyStatus.find({filter:{include:'employee',where:{regionId:id}}}).$promise
                  .then(function (statuses) {

                    $scope.required = [],
                      $scope.optional = [];

                   for(var i =0; i < statuses.length;i++){
                     if(statuses[i].status === "required"){
                       $scope.required.push(statuses[i])
                     }else if(statuses[i].status === "optional"){
                       $scope.optional.push(statuses[i])
                     }
                   }

                  })
              };
              $scope.preventClick = function(){return false;};
              $scope.start = function (employee){
                  var qtr = moment().quarter(),
                    yr = moment().year(),
                    mo = moment().month();
                  console.log(employee.id);

                  RiskAssessment.create({appuserId: ctx.id, employeeId: employee.id, quarter: qtr, year: yr, month: mo, phase:"Evaluation", active: 1})
                    .$promise
                    .then(function(assessment){
                      console.log(assessment);
                      $state.go('ra-mobile.evaluation',{id:assessment.id,active: true});
                    })
                    .catch(function(err){
                      console.error("Error creating risk assessment", err);
                    })

              }
            }

          });



    })
    .controller('ToolBarCtrl', function($scope,$mdSidenav){
      $scope.isSidenavOpen = false;
      $scope.msg ="Not seeing it";
      $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
      };


    })
})();
