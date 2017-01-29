(function(){
  'use strict';

  angular.module('com.module.assessment')
    .factory('Timer', function(RiskAssessment){
      var Timer = {
        startTime: null,
        set: function(val){Timer.startTime = val; console.log(val)},
        clear: function(){Timer.startTime = null},
        get: function(raId){ return RiskAssessment.findById({id:raId})},
        setPhase1: function(raId,val){
        RiskAssessment.updateAttributes({id: raId, phase1Timer: Number(val)}).$promise.then(function(update){ Timer.phase1 = update.phase1Timer; console.info(update)}).catch(function(err){console.error(err, "setPhase1 error.")})
          },

        setPhase2: function(raId,val){
          RiskAssessment.updateAttributes({id: raId, phase2Timer: Number(val)}).$promise.then(function(update){Timer.phase2 = update.phase2Timer; console.info(update.phase2Timer)}).catch(function(err){console.error(err, "setPhase2 error.")})},

        setPhase3: function(raId,val){
          RiskAssessment.updateAttributes({id: raId, phase3Timer: Number(val)}).$promise.then(function(update){Timer.phase3 = update.phase3Timer; console.info(update)}).catch(function(err){console.error(err, "setPhase3 error.")})}


      };

      return Timer;

    })
})();
