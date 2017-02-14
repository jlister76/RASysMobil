(function(){
  'use strict';

  angular.module('com.module.search')
    .controller('SearchCtrl', function($scope, ctx,RiskAssessment,Employee,$state){
      $scope.user = ctx;
      $scope.selectedMonth = moment().format('MMMM');
      $scope.months = moment.months();
      $scope.quarter = moment().quarter();
      $scope.years = [moment().subtract(5,'year').year(),moment().subtract(4,'year').year(), moment().subtract(3,'year').year(),moment().subtract(2,'year').year(),moment().subtract(1,'year').year(), moment().year()];
      $scope.currentYear = moment().year();

      $scope.getEmployeeList = function(user){
        var accessLevel = ctx.accessLevel;

        switch (accessLevel) {
          case "Region":
            getRegionalEmployees(ctx.accessLevelAreaId);
            break;
          case "Division":
            getDivisionalEmployees(ctx.accessLevelAreaId);
            break;
          case "Project":
            getProjectEmployees(ctx.accessLevelAreaId);
            break;
          case "Group":
            getGroupEmployees(ctx.accessLevelAreaId);
            break;

        }//matches users access type and loads the corresponding data
      };
      function getRegionalEmployees(areaId){
        Employee.find({filter:{where:{regionId: areaId}}})
          .$promise.then(function(data){console.log(data);$scope.employeeList = data;})
      };
      function getDivisionalEmployees(areaId){
        Employee.find({filter:{where:{divisionId: areaId}}})
          .$promise.then(function(data){$scope.employeeList = data;})
      };
      function getProjectEmployees(areaId){
        Employee.find({filter:{where:{projectId: areaId}}})
          .$promise.then(function(data){$scope.employeeList = data;})
      };
      function getGroupEmployees(areaId){
        Employee.find({filter:{where:{groupId: areaId}}})
          .$promise.then(function(data){$scope.employeeList = data;})
      };

      $scope.queryByMonth = function(yr,mo){

        var month = Number(moment().month(mo).format('M'))-1;//-1 months array index starts with zero
        console.log(yr,month);
        $state.go('ra-mobile.monthly-searchresults', {yr:yr,mo:month});
             };
      $scope.queryByQtr = function(yr,qtr){
        console.log(yr,qtr);
        $state.go('ra-mobile.quarterly-searchresults', {yr:yr,qtr:qtr});
      };
      $scope.queryByEmployee = function(yr,id){
        console.log(ctx.id,yr,id);
        $state.go('ra-mobile.employee-searchresults');
      };
    })
    .controller('MonthlyResultsCtrl', function($scope,$stateParams,ctx,RiskAssessment,$http,KeyService){
      $scope.sortBy = function (prop){
        var reverse = !reverse;
      };
      var yr = $stateParams.yr,
        mo = $stateParams.mo;
      $scope.key = KeyService.key;
      console.log(mo, ctx.id);
      RiskAssessment.find({filter:{include:['employee','identifiedHazards','appuser'],where:{active:0, appuserId: ctx.id, month: mo, year: yr}}})
        .$promise
        .then(function(results){
          console.log(results);
          if(results.length < 1){
            $scope.noResults = "No risk assessments found.";
          }
          $scope.results = results;

          for (var x =0; x <results.length; x++){
            console.log(results[x].identifiedHazards);
          }


        })
        .catch(function(err){if(err){console.error(err)}

        });






      $scope.resend = function(assessment){
          console.log("resending verification email", assessment);
        $http.post('api/Riskassessments/resend', {"assessment":assessment})
          .then(function(success){console.log(success)})
          .catch(function(err){console.error(err)})

      };
    })
    .controller('QtlyResultsCtrl', function($scope,$stateParams,ctx,RiskAssessment,$http,KeyService){
      var yr = $stateParams.yr,
        qtr = $stateParams.qtr;
      $scope.key = KeyService.key;
      console.log(ctx.id);
      RiskAssessment.find({filter:{include:['employee','identifiedHazards','appuser'],where: {active:false, appuserId: ctx.id, quarter: qtr, year: yr}}})
        .$promise.then(function(results){
        console.log(results);
        if(results.length < 1){
          $scope.noResults = "No risk assessments found.";
        }
        $scope.results = results;
      }).catch(function(err){console.error(err)})

      $scope.resend = function(assessment){
        console.log("resending verification email", assessment);
        $http.post('api/Riskassessments/resend', {"assessment":assessment})
          .then(function(success){console.log(success)})
          .catch(function(err){console.error(err)})

      };
    })
    .controller('EmployeeResultsCtrl', function($scope,$stateParams,ctx,RiskAssessment,$http,KeyService){
        var yr = $stateParams.yr,
          id = $stateParams.id;
        $scope.key = KeyService.key;

      RiskAssessment.find({filter:{include:['employee','identifiedHazards','appuser'],where: {active: false, appuserId: ctx.id, employeeId: id, year: yr}}})
        .$promise.then(function(results){
          console.log(results);
        if(results.length < 1){
          $scope.noResults = "No risk assessments found.";
        }
        $scope.results = results;

        })
        .catch(function(err){console.error(err)})

      $scope.resend = function(assessment){
        console.log("resending verification email", assessment);
        $http.post('api/Riskassessments/resend', {"assessment":assessment})
          .then(function(success){console.log(success)})
          .catch(function(err){console.error(err)})

      };

    })
})();
