'use strict';

module.exports = function(app){

  var ds = app.dataSources.mssqldb,
    appuser = app.models.appuser,
    region = app.models.Region,
    division = app.models.Division,
    project = app.models.Project,
    group = app.models.Group,
    employee = app.models.Employee,
    modelsAry = [
      'appuser',
      'region',
      'division',
      'project',
      'group',
      'employee',
      'riskAssessment',
      'identifiedHazard',
      'quarterlyStatus',
      'monthlyStatus'
    ];
 /*ds.automigrate(modelsAry, function(){
   buildDemoApp();

   function buildDemoApp(){
     var regions = [],
       divisions = [],
       projects = [],
       groups = [];
     //create 2 regions
     for (var i = 1; i <= 2; i++) {
       createRegion(i);
     }
     function createRegion(inc) {

       var regionObj = {};
       var newRegion = regionObj.title = "Region " + inc;
       region.create(regionObj, function (err, success) {
         if (err) {
           console.error(err)
         }
         console.log(success);
         //create 2 divisions for each region
         var regionId = success.id;
         for (var d = 1; d <= 3; d++) {
           createDivision(regionId, d)
         }

       })

     }
     function createDivision(regionId, inc) {
       var divisionObj = {};
       divisionObj.title = "Division " + inc;
       divisionObj.regionId = regionId;

       division.create(divisionObj, function (err, success) {
         if (err) {
           console.error(err)
         }
         console.log(success);
         //create 2 projects for each division
         var regionId = success.regionId,
           divisionId = success.id;

         for(var p = 1; p <= 2; p++){
           createProject(regionId,divisionId,p)
         }

       });
     }
     function createProject(regionId,divisionId,inc){
       var projectObj = {};
       projectObj.title = "Project " + inc;
       projectObj.regionId = regionId;
       projectObj.divisionId = divisionId;

       project.create(projectObj,function(err,success){
         if(err){console.error(err)}
         console.log(success);
         //create 3 groups for each project
         var regionId = success.regionId,
           divisionId = success.divisionId,
           projectId = success.id;
         for(var g = 1; g <= 3; g++){
           createGroup(regionId,divisionId,projectId,g);
         }

       })
     }
     function createGroup(regionId,divisionId,projectId,inc) {
       var groupObj = {};
       groupObj.title = "Group " + inc;
       groupObj.regionId = regionId;
       groupObj.divisionId = divisionId;
       groupObj.projectId = projectId;

       //create 3 groups for project
       group.create(groupObj, function(err,success){
         if(err){console.error(err)}
         console.info(success);
         //create 3 employees for each group
         var regionId = success.regionId,
           divisionId = success.divisionId,
           projectId = success.projectId,
           groupId = success.id;
         for(var e = 1; e <= 3; e++){
           createEmployee(regionId,divisionId,projectId,groupId,e);
         }


       })
     }
     function createEmployee(regionId,divisionId,projectId,groupId,inc) {
       var newEmployee = {};
       newEmployee.fname = "Employee " + inc;
       newEmployee.lname = "Test";
       newEmployee.email = "rasys-dev@outlook.com";
       newEmployee.employeeNumber = 1234;
       newEmployee.regionId = regionId;
       newEmployee.divisionId = divisionId;
       newEmployee.projectId = projectId;
       newEmployee.groupId = groupId;

       //change hire date on every 3rd employee created
       if(inc === 3){
         newEmployee.hire_date = new Date("2016/1/1");
       }else{
         newEmployee.hire_date = new Date("2017/1/1");
       }
       employee.create(newEmployee, function(err,success){
         if(err){console.error(err)}
         console.info(success)
       });

     }

     //create 1 appuser for each accessLevel
     //create region user for region 1
     appuser.create({"fname": "Region", "lname": "User", "accessLevel": "Region", "accessLevelAreaId": 1, "email": "regionuser@outlook.com", "password": "1234"});
     //todo: consider removing "jobTitle" from appuser model.
     //create a division user for division 1
     appuser.create({"fname": "Division", "lname": "User", "accessLevel": "Division", "accessLevelAreaId": 1, "email": "divisionuser@outlook.com", "password": "1234"});
     //create a project user for project 2
     appuser.create({"fname": "Project", "lname": "User", "accessLevel": "Project", "accessLevelAreaId": 2, "email": "projectuser@outlook.com", "password": "1234"});
     //create a group user for group 4
     appuser.create({"fname": "Group", "lname": "User", "accessLevel": "Group", "accessLevelAreaId": 4, "email": "groupuser@outlook.com", "password": "1234"})

   }
  });*/

 //ds.autoupdate(modelsAry);

};
