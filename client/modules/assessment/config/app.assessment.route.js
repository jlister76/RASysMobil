(function () {
  'use strict';
  /**
   * @ngdoc overview
   * @name com.module.assessment
   * @modules
   * @description
   * @requires loopbackApp
   *
   * The `com.modules.core` modules provides services for interacting with
   * the models exposed by the LoopBack server via the REST API.
   *
   */
  angular.module('com.module.assessment')
    .config(function($stateProvider){
      $stateProvider
        .state('ra-mobile.new', {
          'abstract': true,
          url: '/new',
          resolve: {
            ctx: function(AuthService){
              return AuthService.getCurrent();
            }
          },
          params:{
            type: null
          },
          template: '<div style="" ui-view></div>'
        })
        .state('ra-mobile.new.assessment', {
          url: '/assessment',
          resolve:{
            ctx: function(AuthService){
              return AuthService.getCurrent().$promise;
            }
          },
          templateUrl: 'modules/assessment/views/new.assessment.html',
          controller: 'NewAssessmentCtrl'
        })
        .state('ra-mobile.new.showDivisions', {
          url: '/show-divisions',
          resolve: {
            ctx: function(AuthService){ return AuthService.getCurrent().$promise},
            data: function (ctx,Division) {
              return Division.find({filter:{where:{regionId:ctx.accessLevelAreaId}}}).$promise
            }
          },
          templateUrl: 'modules/assessment/views/show-area.html',
          controller: 'ShowDivisionsCtrl'
        })
        .state('ra-mobile.new.showProjects', {
          url: '/show-projects',
          resolve: {
            ctx: function (AuthService) {
              return AuthService.getCurrent().$promise
            },
            data: function(ctx,Project){
              console.log(ctx.accessLevelAreaId);
              var accessLevel = ctx.accessLevel;
              switch (accessLevel){
                case "Division":
                  return Project.find({filter:{where:{divisionId:ctx.accessLevelAreaId}}}).$promise
                  break;
                default:
                  var id = sessionStorage.getItem('id');
                  return Project.find({filter:{where:{divisionId:id}}}).$promise
              }

            }
          },
          templateUrl: 'modules/assessment/views/show-area.html',
          controller: 'ShowProjectsCtrl'
        })
        .state('ra-mobile.new.showGroups', {
          url: '/show-groups',
          resolve: {
            ctx: function (AuthService) {
              return AuthService.getCurrent().$promise
            },
            data: function(ctx,Group){
              console.log(ctx.accessLevelAreaId);
              var accessLevel = ctx.accessLevel;
              switch (accessLevel){
                case "Project":
                  return Group.find({filter:{where:{projectId:ctx.accessLevelAreaId}}}).$promise
                  break;
                default:
                  var id = sessionStorage.getItem('id');
                  return Group.find({filter:{where:{projectId:id}}}).$promise
              }

            }
          },
          templateUrl: 'modules/assessment/views/show-area.html',
          controller: 'ShowGroupsCtrl'
        })
        .state('ra-mobile.new.showEmployees', {
          url: '/show-employees',
          resolve: {
            ctx: function (AuthService) {
              return AuthService.getCurrent().$promise
            },
            data: function(ctx,Employee){
              console.log(ctx.accessLevelAreaId);
              var accessLevel = ctx.accessLevel;
              switch (accessLevel){
                case "Group":
                  return Employee.find({filter:{where:{groupId:ctx.accessLevelAreaId}}}).$promise
                break;
                default:
                  var id = sessionStorage.getItem('id');
                  return Employee.find({filter:{where:{groupId:id}}}).$promise
              }

            }
          },
          templateUrl: 'modules/assessment/views/show-employees.html',
          controller: 'ShowEmployeesCtrl'
        })
        .state('ra-mobile.list', {
          url: '/assessment-list',
          params: {
            employeeId: null,
            assessmentId: null,
            status: null,
            assessments: null
          },
          templateUrl: 'modules/assessment/views/assessment-list.html',
          controller: 'ListCtrl'
        })
        .state('ra-mobile.evaluation', {
          url: '/evaluation/?id?active/?phase',
          templateUrl: 'modules/assessment/views/evaluation.html',
          controller: 'EvaluationCtrl'
        })
        .state('ra-mobile.coaching', {
          url: '/coaching/?id?active',
          params: {
            data: null
          },
          templateUrl: 'modules/assessment/views/coaching.html',
          controller: 'CoachingCtrl'
        })
        .state('ra-mobile.recognize', {
        url: '/recognize-react/?id/?active',
        params: {
          data: null
        },
        templateUrl: 'modules/assessment/views/recognize.html',
        controller: 'RecognizeCtrl'
      })
        .state('ra-mobile.verify', {
          url: '/verify/?id/?active',
          params: {
            data: null
          },
          templateUrl: 'modules/assessment/views/verification.html',
          controller: 'VerficationCtrl'
        })

    })


})();
