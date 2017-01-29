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
    .config(function($stateProvider, $urlRouterProvider){
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
        templateUrl: 'modules/assessment/views/new.assessment.html',
        controller: 'NewAssessmentCtrl'
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
