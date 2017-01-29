(function(){
  'use strict';

  angular.module('com.module.assessment')
    .controller('NewAssessmentCtrl', function($scope,$state,AuthService,Division,Project,Group,Employee,RiskAssessment){

      AuthService.getCurrent()
        .$promise
        .then(function(ctx){

          return ctx;
        })
        .then(function(ctx) {
          var type = ctx.accessLevelType,
            groupId = ctx.accessLevelGroupId;
            console.log(ctx.id);
          RiskAssessment.find({filter:{include:['identifiedHazards','employee'], where:{appuserId:ctx.id,active: true}}})
            .$promise
            .then(function(records){
              console.log("Building list...",records);
              $scope.list = 1;
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
                  }

                };

              });
            })
            .catch(function(err){
              console.info("There are no active risk assessments.");
             $scope.selectEmployee();
            });


      function getDivisionList() {
        Division.find({"filter": {"where": {"regionId": groupId}}})
          .$promise
          .then(function (divisions) {
            $scope.groups = divisions;


            console.log(divisions);
          })
          .catch(function (e) {
            console.error(e);
          });
      };
      function getProjectList() {
        Project.find({"filter": {"where": {"divisionId": groupId}}})
          .$promise
          .then(function (projects) {
            $scope.groups = projects;
            console.log(projects);
          })
          .catch(function (e) {
            console.error(e)
          });
      };
      function getGroupList() {
        Group.find({"filter": {"where": {"projectId": groupId}}})
          .$promise
          .then(function (groups) {

            $scope.groups = groups;
            console.log(groups);
          })
          .catch(function (e) {
            console.error(e)
          })
      };
      function getEmployeeList() {
        Employee.find({"filter": {"where": {"groupId": groupId}}})
          .$promise
          .then(function (employees) {
            $scope.employees = employees;
            console.log(employees);
          })
          .catch(function (e) {
            console.error(e);
          });
      };
      $scope.preventClick = function(){return false;};
      $scope.selectEmployee = function(){
        if($scope.list){
          $scope.list = 0;
        }
        switch (type) {
          case "regional":
            $scope.showDivisions = 1;
            getDivisionList();
            break;
          case "division":
            $scope.showProjects = 1;
            getProjectList();
            break;
          case "project":
            $scope.showGroups = 1;
            getGroupList();
            break;
          case "group":
            console.log("Running employees from case");
            $scope.showEmployees = 1;
            getEmployeeList();
            break;

        }//matches users access type and loads the corresponding data
      };
      $scope.listProjects = function (id) {
        $scope.showDivisions = 0;
        $scope.showProjects = 1;
        Project.find({"filter": {"where": {divisionId: id}}})
          .$promise
          .then(function (projects) {

            $scope.groups = projects;
          })
      };
      $scope.listGroups = function (id) {
        $scope.showProjects = 0;
        $scope.showGroups = 1;
        Group.find({"filter": {"where": {projectId: id}}})
          .$promise
          .then(function (groups) {

            $scope.groups = groups;
          })
      };
      $scope.listEmployees = function (id) {
        console.log("Running employees");
        $scope.showGroups = 0;
        $scope.showEmployees = 1;
        Employee.find({"filter": {"where": {groupId: id}}})
          .$promise
          .then(function (employees) {
            console.log(employees);
            $scope.employees = employees;
          })
      };
      $scope.toDivisionList = function(){
        if($scope.showProjects === 1){
          $scope.showProjects = 0;
          $scope.showDivisions = 1;
          getDivisionList();
        }else if($scope.showGroups === 1){
          $scope.showGroups = 0;
          $scope.showDivisions = 1;
          getDivisionList();
        }else if($scope.showEmployees){
          $scope.showEmployees = 0;
          $scope.showDivisions = 1;
          getDivisionList();
        }
      };
      $scope.toProjectList = function(){
        if($scope.showGroups === 1){
          $scope.showGroups = 0;
          $scope.showProjects = 1;
          getProjectList();
        }else if($scope.showEmployees === 1){
          $scope.showEmployees = 0;
          $scope.showProjects = 1;
          getProjectList();

        }

      };
      $scope.toGroupList = function(){
        console.log("navigating to groupList");
        $scope.showProjects = 0;
        $scope.showEmployees = 0;
        $scope.showGroups = 1;
        getGroupList();

      };
      $scope.confirmEmployee = function (employee) {
            console.log(employee);
            $scope.showEmployees = 0;
            $scope.showSelected = 1;
            $scope.selectedEmployee = employee;
          };
      $scope.start = function(employee){
        console.log(employee);
        RiskAssessment.create({appuserId: ctx.id, employeeId: employee.id, phase:"Evaluation", active: true})
          .$promise
          .then(function(assessment){
            console.log(assessment);
            $state.go('ra-mobile.evaluation',{id:assessment.id,active: true});
          })
          .catch(function(err){
            console.error("Error creating risk assessment", err);
          })


      };
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
      $scope.tip = {
        showToolTip: false,
        tipDirection: ''
      }


        })
    })
})();
