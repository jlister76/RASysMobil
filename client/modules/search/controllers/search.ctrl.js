(function(){
  'use strict';

  angular.module('com.module.search')
    .controller('SearchCtrl', function($scope, ctx,RiskAssessment,Employee,$state){
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
      $scope.years = [moment().subtract(5,'year').year(),moment().subtract(4,'year').year(), moment().subtract(3,'year').year(),moment().subtract(2,'year').year(),moment().subtract(1,'year').year(), moment().year()];
      $scope.currentYear = moment().year();

      $scope.getEmployeeList = function(user){
        var type = ctx.accessLevelType;
        console.log(type);
        switch (type) {
          case "regional":
            getRegionalEmployees(ctx.accessLevelAreaId);
            break;
          case "division":
            getDivisionalEmployees(ctx.accessLevelAreaId);
            break;
          case "project":
            getProjectEmployees(ctx.accessLevelAreaId);
            break;
          case "group":
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
        $state.go('ra-mobile.monthly', {yr:yr,mo:mo});
             };
      $scope.queryByQtr = function(yr,qtr){
        RiskAssessment.find({filter:{include:['employee','identifiedHazards'],where: {active:false, appuserId: ctx.id, quarter: qtr, year: yr}}})
          .$promise.then(function(results){$state.go('ra-mobile.results', {results:results});}).catch(function(err){console.error(err)})
      };
      $scope.queryByEmployee = function(yr,id){
        console.log(ctx.id,yr,id);
        RiskAssessment.find({filter:{include:['employee','identifiedHazards'],where: {active: false, appuserId: ctx.id, employeeId: id, year: yr}}})
          .$promise.then(function(results){$state.go('ra-mobile.results', {results:results}); console.log(results)}).catch(function(err){console.error(err)})
      };
    })
    .controller('MonthlyCtrl', function($scope,$stateParams,ctx,RiskAssessment,$http){
      var yr = $stateParams.yr,
        mo = $stateParams.mo;

      RiskAssessment.find({filter:{include:['employee','identifiedHazards'],where:{active:false, appuserId: ctx.id, month: mo, year: yr}}})
        .$promise
        .then(function(results){ $scope.results = results;})
        .catch(function(err){console.error(err)});

      $scope.resend = function(assessment){
          console.log("action fired", assessment);
        $http.post('api/Riskassessments/verify', {"assessment":assessment})
          .then(function(success){console.log(success);
            RiskAssessment.updateAttributes({id:assessmentId})
              .$promise
              .then(function(success){console.log(success);})
              .catch(function(err){console.error(err)});
          });
      };
    })

})();
