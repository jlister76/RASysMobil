(function(){
  'use strict';

  angular.module('com.module.assessment')
    .factory('PreviousState', function ($rootScope, $state) {
      var PreviousState = {};
      $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams
        , fromState, fromParams) {

        PreviousState.fromState = fromState.name;
        PreviousState.lastHref = $state.href(fromState.name);

      });
      return PreviousState
    })
})();
