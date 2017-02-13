(function(){
  'use strict';

  angular.module('com.module.assessment')
    .controller('NewAssessmentCtrl', function($scope,$state,ctx,RiskAssessment){
        var type = ctx.accessLevel,
            groupId = ctx.accessLevelAreaId;
            console.log(ctx.id, type, groupId);
          RiskAssessment.find({filter:{include:['identifiedHazards','employee'], where:{appuserId:ctx.id,active: true}}})
            .$promise
            .then(function(records){
              console.log("Building list...",records);

              $scope.assessments =[];
              $scope.assessmentHazards = [];

              records.forEach(function(r){
                $scope.assessments.push(r);
                $scope.assessmentHazards.push(r.identifiedHazards.length);
                $scope.doAssessment = function(id,status,phase){
                  console.log(id,status,phase);
                  switch (phase){
                    case "Evaluation":
                      $state.go('ra-mobile.evaluation',{id: id, active: status});
                      break;
                    case "Coaching":
                      $state.go('ra-mobile.coaching',{id: id, active: status});
                      break;
                    case "Recognize & React":
                      $state.go('ra-mobile.recognize',{id: id, active: status});
                      break;
                    case "Verification":
                      $state.go('ra-mobile.verify',{id: id, active: status})
                          break;
                    default: //add default case
                      break;
                  }//returns to assessment

                };

              });
            })
            .catch(function(err){
              if(err){
                console.error(err);
              }
              console.info("There are no active risk assessments.");

            });
      $scope.showList = function(){
        if($scope.list){
          $scope.list = 0;
        }
        switch (type) {
          case "Region":
            $state.go('ra-mobile.new.showDivisions');
            break;
          case "Division":
            $state.go('ra-mobile.new.showProjects');
            break;
          case "Project":
            $state.go('ra-mobile.new.showGroups');
            break;
          case "Group":
            $state.go('ra-mobile.new.showEmployees');
            break;

        }//matches users access type and loads the corresponding data
      };
      $scope.preventClick = function(){return false;};
      $scope.deleteAssessment = function(id){
        console.log(id);
        RiskAssessment.destroyById({"id":id})
          .$promise
          .then(function(id){
            console.log(id,"Risk Assessment succesfully deleted.");

            $state.reload();

          })
          .catch(function(err,id){console.error(err, "Error deleting Risk Assessment",id)});

      };

    })
    .controller('ShowDivisionsCtrl', function($scope,$state,ctx,data){

      $scope.previousState = function(){$state.go('ra-mobile.new.assessment')};
      $scope.listType = "Divisions";
      $scope.groups = data;
      $scope.showList = function(id){
            sessionStorage.setItem("id", id);
            $state.go('ra-mobile.new.showProjects')
          };
      $scope.preventClick = function(){return false;};
    })
    .controller('ShowProjectsCtrl', function($scope,$state,ctx,data){
      $scope.type = "Projects";
      $scope.groups = data;
      $scope.showList = function(id){
        sessionStorage.setItem('id',id);
        $state.go('ra-mobile.new.showGroups')
      };
      $scope.preventClick = function(){return false;};
      var accessLevel = ctx.accessLevel;
      switch(accessLevel){
        case "Division":
          $scope.previousState = function () {$state.go('ra-mobile.new.assessment')};
          break;
        case "Region":
          $scope.previousState = function(){ sessionStorage.setItem('id', ctx.accessLevelAreaId); $state.go('ra-mobile.new.showDivisions')};
          break;
      }
    })
    .controller('ShowGroupsCtrl', function($scope,$state,ctx,data){
      $scope.type = "Groups";
      $scope.groups = data;
      $scope.showList = function(id){
        sessionStorage.setItem('id',id);
        $state.go('ra-mobile.new.showEmployees')};
      $scope.preventClick = function(){return false;};
      var accessLevel = ctx.accessLevel;
      switch(accessLevel){
        case "Project":
          $scope.previousState = function () {$state.go('ra-mobile.new.assessment')};
          break;
        default:
          console.log('test')
          $scope.previousState = function () {sessionStorage.setItem('id',data[0].divisionId); $state.go('ra-mobile.new.showProjects')};
          break;
      }

    })
    .controller('ShowEmployeesCtrl', function($scope,$state,ctx,data,RiskAssessment){
      $scope.type = "Employees";
      $scope.employees = data;
      $scope.start = function (employee){
        sessionStorage.removeItem('id');
        start(employee);
        function start(employee){
          var qtr = moment().quarter(),
            yr = moment().year(),
            mo = moment().month();
          console.log(ctx.id,employee.id,qtr,yr,mo);

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
      $scope.preventClick = function(){return false;};
      var accessLevel = ctx.accessLevel;
      switch(accessLevel){
        case "Group":
          $scope.previousState = function () {$state.go('ra-mobile.new.assessment')};
          break;
        default:
          $scope.previousState = function(){ sessionStorage.setItem('id', data[0].projectId); $state.go('ra-mobile.new.showGroups')};
          break;
      }

    })
})();
