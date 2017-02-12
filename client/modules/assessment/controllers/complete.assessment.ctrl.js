(function(){
  'use strict';

  angular.module('com.module.assessment')
    .controller('EvaluationCtrl', function($scope,$state,$stateParams, RiskAssessment,IdentifiedHazard,Timer,PreviousState,KeyService){

      //Google API Key
      $scope.key = KeyService.key;

      //Geo Location
      navigator.geolocation.getCurrentPosition(successCallback,
        errorCallback,
        {enableHighAccuracy: true, maximumAge:30000, timeout:2700});

      function successCallback(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
        // By using a 'timeout' of 0 milliseconds, if there is
        // no suitable cached position available, the user agent
        // will asynchronously invoke the error callback with code
        // TIMEOUT and will not initiate a new position
        // acquisition process.
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log(lat,lng,position.coords.accuracy);
        $scope.lat = lat;
        $scope.lng = lng;
        $scope.accuracy = position.coords.accuracy;
        sessionStorage.setItem("latitude", lat);
        sessionStorage.setItem("longitude", lng);
      }
      function errorCallback(error) {
        switch(error.code) {
          case error.TIMEOUT:
            // Quick fallback when no suitable cached position exists.
            doFallback();
            // Acquire a new position object.
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
            break;
          default: console.log("Location Error")// treat the other error cases.
        };
      }//TODO: create error handling for error types
      function doFallback() {
        // No fresh enough cached position available.
        // Fallback to a default position.
      }
      RiskAssessment.find({filter:{include:['employee','identifiedHazards'],where:{id: $stateParams.id}}})
        .$promise
        .then(function(ra){
          console.log(ra);


          $scope.assessment = ra;
          $scope.assessmentId = ra[0].id;
          $scope.assessmentStatus = ra[0].active;
          $scope.employee = ra[0].employee;

          $scope.identifiedHazards = [];
          ra[0].identifiedHazards.forEach(function(h){
            if(h.phase === "Evaluation"){
              $scope.identifiedHazards.push(h);
            }
          });
          /**Timer Utility**************************************/
          startTimer();
          function startTimer(){

            if(moment.isMoment(Timer.startTime)){
              console.info("Clock is already running")
            }else{
              var time = moment();
              Timer.set(time);
            }
          }
          function stopTimer() {
            var currentTime = moment();
            var startTime = Timer.startTime;
            var diff = currentTime.diff(startTime);
            var currentDuration = moment.duration(diff);
            if (ra[0].phase1Timer != 0) {
              var previousDuration = moment.duration(ra[0].phase1Timer);
              var total = moment.duration(currentDuration).add(previousDuration);
              var x = total.hours() +":"+ total.minutes();
              console.log("The previous time of ", Number(previousDuration), " milleseconds, plus this current time of ", Number(currentDuration), " milleseconds is a total of ", x, " seconds spent on this ",PreviousState.lastHref," .");
              Timer.setPhase1(ra[0].id,Number(total));
            } else {
              console.log("Total time spent on this ",PreviousState.lastHref," was ", x, " milleseconds.");
              Timer.setPhase1(ra[0].id,Number(currentDuration));

            }
          }
          $scope.$on('$destroy', function(){stopTimer()});
          /*****************************************************/
            return ra;
        });

        $scope.safe = "safe";
        $scope.at_risk = "at-risk";
        $scope.hazards = ["Snow/Ice",
          "Loose Gravel/Dirt",
          "Wet Grass/Mud",
          "Overgrown Vegetation",
          "Poison Ivy/Oak/Sumac",
          "Surface Transition",
          "Change in Elevation",
          "Holes",
          "Debris [boards, nails, etx.]," +
          "Tripping Hazards",
          "Fences",
          "Poor Visibility",
          "Vehicular Traffic",
          "Hand Tools",
          "Lifting",
          "Basement/Attic Debris",
          "Stairs/Ladders",
          "Low Ceilings",
          "Dogs",
          "Bees",
          "Tick/Fleas",
          "Ants",
          "Snakes",
          "Spiders",
          "Livestock",
          "Look ahead 15 seconds",
          "4-Second following distance",
          "Scan a mirror 5 to 8 seconds",
          "Move eyes every 2 seconds",
          "Surround vehicle with space",
          "Seek eye contact",
          "Avoid backing if possible," +
          "Backing slowly",
          "Backing upon arrival",
          "G.O.A.L. - Get out and look",
          "Distracted driving",
          "Drivers Lincese Check"];
        $scope.chkRequiredInput = function(){
          if($scope.selectedHazard && $scope.behavior && $scope.comments){
            return true;
          }
        };
        $scope.save = function(id,hazard,behavior,comments,lat,lng){
          console.log(hazard,behavior,comments,lat,lng);
          IdentifiedHazard.create({type: hazard,location: {lat:lat,lng:lng},reaction: behavior, comments: comments, riskAssessmentId:id, phase: "Evaluation"})
            .$promise
            .then(function(ih){
              console.log(ih, " created successfully");
              $state.reload();
            })

        };
        $scope.deleteIdentifiedHazard = function(id){
          IdentifiedHazard.destroyById({id:id})
            .$promise
            .then(function(hazard){
              $state.reload();
              console.info(hazard, "Successfully deleted.")
            })
            .catch(function(err){console.error(err)})
        };
        $scope.updateIdentifiedHazard = function(id,hazard,behavior,comments, assessmentId,lat,lng){
          lat = sessionStorage.getItem('latitude');
          lng = sessionStorage.getItem('latitude');
          console.log(id,hazard,behavior,comments,lat,lng);
          IdentifiedHazard.updateAttributes({id:id, type:hazard, location: {lat:lat,lng:lng}, reaction: behavior, comments: comments, riskAssessmentId:assessmentId, phase: "Evaluation"})
            .$promise
            .then(function(){
              console.log("Hazard updated successfully");
              $state.reload();
            })
            .catch(function(err){console.error(err, "Unable to update hazard")})

        };
        $scope.preventClick = function(){return false;};

    })
    .controller('CoachingCtrl', function($scope,$state,$stateParams,RiskAssessment,Timer,PreviousState){

      RiskAssessment.find({filter:{include:['employee'],where:{id: $stateParams.id}}})
        .$promise
        .then(function(ra){

          $scope.assessmentId = ra[0].id;
          $scope.assessmentStatus = ra[0].active;
          $scope.employee = ra[0].employee;


          RiskAssessment.updateAttributes({id:ra[0].id, phase:"Coaching"}).$promise.then(function(update){console.info(update)})//update assessment phase

          /**Timer Utility**************************************/
          startTimer();
          function startTimer(){

            if(moment.isMoment(Timer.startTime)){
              console.info("Clock is already running")
            }else{
              var time = moment();
              Timer.set(time);
            }
          };
          function stopTimer() {
            var currentTime = moment();
            var startTime = Timer.startTime;
            var diff = currentTime.diff(startTime);
            var currentDuration = moment.duration(diff);


            if (ra[0].phase2Timer != 0) {

              var previousDuration = moment.duration(ra[0].phase2Timer);

              var total = moment.duration(currentDuration).add(previousDuration);
              var x = total.hours() +"hrs :"+ total.minutes()+" mins";
              console.log("The previous time of ", previousDuration, " milliseconds, plus this current time of ", currentDuration, " milliseconds is a total of ", x, " spent on this ",PreviousState.lastHref,".");
              Timer.setPhase2(ra[0].id, Number(total));

            } else {
              console.log("Total time spent on this ",PreviousState.lastHref," was ", x, " milliseconds.");
              Timer.setPhase2(ra[0].id, Number(currentDuration));

            }
          };
          $scope.$on('$destroy', function(){stopTimer()});
          /*****************************************************/
          return ra;
        })
    })
    .controller('RecognizeCtrl', function($scope,$state,$stateParams,RiskAssessment,IdentifiedHazard,Timer,PreviousState,KeyService){

      //Geo Location
      navigator.geolocation.getCurrentPosition(successCallback,
        errorCallback,
        {enableHighAccuracy: true, maximumAge:30000, timeout:2700});


      function successCallback(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
        // By using a 'timeout' of 0 milliseconds, if there is
        // no suitable cached position available, the user agent
        // will asynchronously invoke the error callback with code
        // TIMEOUT and will not initiate a new position
        // acquisition process.
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log(lat,lng,position.coords.accuracy);
        $scope.lat = lat;
        $scope.lng = lng;
        $scope.accuracy = position.coords.accuracy;
        sessionStorage.setItem("latitude", lat);
        sessionStorage.setItem("longitude", lng);
      }
      function errorCallback(error) {
        switch(error.code) {
          case error.TIMEOUT:
            // Quick fallback when no suitable cached position exists.
            doFallback();
            // Acquire a new position object.
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
            break;
          default: console.log("Location Error")// treat the other error cases.
        };
      }//TODO: create error handling for error types
      function doFallback() {
        // No fresh enough cached position available.
        // Fallback to a default position.
      }
      RiskAssessment.find({filter:{include:['identifiedHazards','employee'],where:{id: $stateParams.id}}})
        .$promise
        .then(function(ra){
          console.log(ra);
          $scope.assessment = ra;
          $scope.assessmentId = ra[0].id;
          $scope.assessmentStatus = ra[0].active;
          $scope.employee = ra[0].employee;

          RiskAssessment.updateAttributes({id:ra[0].id, phase:"Recognize & React"});
          $scope.identifiedHazards = [];
          ra[0].identifiedHazards.forEach(function(h){
           if(h.phase === "Recognize & React"){
             $scope.identifiedHazards.push(h);
             console.log($scope.identifiedHazards)
           }
          });
          /**Timer Utility**************************************/
          startTimer();
          function startTimer(){

            if(moment.isMoment(Timer.startTime)){
              console.info("Clock is already running")
            }else{
              var time = moment();
              Timer.set(time);
            }
          }
          function stopTimer() {
            var currentTime = moment();
            var startTime = Timer.startTime;
            var diff = currentTime.diff(startTime);
            var currentDuration = moment.duration(diff);

            if (ra[0].phase3Timer != 0) {
              var previousDuration = moment.duration(ra[0].phase3Timer);
              var total = moment.duration(currentDuration).add(previousDuration);
              console.log("The previous time of ", Number(previousDuration), " milliseconds, plus this current time of ", Number(currentDuration), " milliseconds is a total of ", Number(total), " seconds spent on this ",PreviousState.lastHref,".");
              Timer.setPhase3(ra[0].id, Number(total));

            } else {
              console.log("Total time spent on this ",PreviousState.lastHref," was ", Number(currentDuration), " milliseconds.");
              Timer.setPhase3(ra[0].id, Number(currentDuration));

            }
          }
          $scope.$on('$destroy', function(){stopTimer()});
          /*****************************************************/
          return ra;
        });

      $scope.safe = "safe";
      $scope.at_risk = "at-risk";
      $scope.hazards = ["Snow/Ice",
        "Loose Gravel/Dirt",
        "Wet Grass/Mud",
        "Overgrown Vegetation",
        "Poison Ivy/Oak/Sumac",
        "Surface Transition",
        "Change in Elevation",
        "Holes",
        "Debris [boards, nails, etx.]," +
        "Tripping Hazards",
        "Fences",
        "Poor Visibility",
        "Vehicular Traffic",
        "Hand Tools",
        "Lifting",
        "Basement/Attic Debris",
        "Stairs/Ladders",
        "Low Ceilings",
        "Dogs",
        "Bees",
        "Tick/Fleas",
        "Ants",
        "Snakes",
        "Spiders",
        "Livestock",
        "Look ahead 15 seconds",
        "4-Second following distance",
        "Scan a mirror 5 to 8 seconds",
        "Move eyes every 2 seconds",
        "Surround vehicle with space",
        "Seek eye contact",
        "Avoid backing if possible," +
        "Backing slowly",
        "Backing upon arrival",
        "G.O.A.L. - Get out and look",
        "Distracted driving",
        "Drivers Lincese Check"];
      $scope.chkRequiredInput = function(){
        if($scope.selectedHazard && $scope.comments && $scope.behavior){
          return true;
        }
      };
      $scope.save = function(id,hazard,behavior,comments,lat,lng){
        console.log(hazard,behavior,comments,lat,lng);


        IdentifiedHazard.create({type: hazard,location: {lat:lat,lng:lng},reaction: behavior, comments: comments, riskAssessmentId:id, phase: "Recognize & React"})
          .$promise
          .then(function(ih){
            console.log(ih, " created successfully");
            $state.reload();
          })

      };
      $scope.deleteIdentifiedHazard = function(id){
        IdentifiedHazard.destroyById({id:id})
          .$promise
          .then(function(hazard){
            $state.reload();
            console.info(hazard, "Successfully deleted.")
          })
          .catch(function(err){console.error(err)})
      };
      $scope.updateIdentifiedHazard = function(id,hazard,behavior,comments, assessmentId,phase,lat,lng){
        navigator.geolocation.getCurrentPosition(successCallback,
          errorCallback,
          {enableHighAccuracy: true, maximumAge:30000, timeout:2700});
        console.log(id,hazard,behavior,comments,phase,lat,lng);

        IdentifiedHazard.updateAttributes({id:id, type:hazard, location: {lat:lat,lng:lng}, reaction: behavior, comments: comments, riskAssessmentId:assessmentId, phase:"Recognize & React"})
          .$promise
          .then(function(){
            console.log("Hazard updated successfully");
            $state.reload();
          })
          .catch(function(err){console.error(err, "Unable to update hazard")})

      };
      $scope.preventClick = function(){return false;};



    })
    .controller('VerficationCtrl', function($scope,$state,$stateParams,RiskAssessment,IdentifiedHazard,Employee,Timer,KeyService,$http){

      //Geo Location
      navigator.geolocation.getCurrentPosition(successCallback,
        errorCallback,
        {enableHighAccuracy: true, maximumAge:30000, timeout:2700});
      function successCallback(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
        // By using a 'timeout' of 0 milliseconds, if there is
        // no suitable cached position available, the user agent
        // will asynchronously invoke the error callback with code
        // TIMEOUT and will not initiate a new position
        // acquisition process.
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        console.log(lat,lng,position.coords.accuracy);
        $scope.lat = lat;
        $scope.lng = lng;
        sessionStorage.setItem("latitude", lat);
        sessionStorage.setItem("longitude", lng);
      }
      function errorCallback(error) {
        switch(error.code) {
          case error.TIMEOUT:
            // Quick fallback when no suitable cached position exists.
            doFallback();
            // Acquire a new position object.
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
            break;
          default: console.log("Location Error")// treat the other error cases.
        };
      }//TODO: create error handling for error types
      function doFallback() {
        // No fresh enough cached position available.
        // Fallback to a default position.
      }
      $scope.updateLocation = function(){
        navigator.geolocation.getCurrentPosition(successCallback,
        errorCallback, {enableHighAccuracy: true, maximumAge:10000, timeout:2700});
        $scope.lat = sessionStorage.getItem('latitude');
        $scope.lng = sessionStorage.getItem('longitude');
        $state.reload();

      };

       $scope.lat = sessionStorage.getItem('latitude');
       $scope.lng = sessionStorage.getItem('longitude');
       $scope.key = KeyService.key;
      $scope.url = 'https://maps.googleapis.com/maps/api/staticmap?&size=450x250&maptype=roadmap' +
      '&markers=color:blue%7Clabel:S%7C'+$scope.lat+','+$scope.lng+'&scale=2&key='+$scope.key;
      RiskAssessment.find({filter:{include:['identifiedHazards','employee','appuser'],where:{id: $stateParams.id}}})
        .$promise
        .then(function(ra){
          console.log(ra[0].appuser);
          $scope.assessment = ra;
          $scope.user = ra[0].appuser;
          $scope.assessmentId = ra[0].id;
          $scope.assessmentStatus = ra[0].active;
          $scope.employee = ra[0].employee;
          $scope.expirationDate = ra[0].driversLicenseExpiration;
          $scope.weatherConditions = ["Fair","Windy","Wet","Foggy","Snowing","Icy"];
          $scope.safeReactions =[];
          $scope.allReactions = ra[0].identifiedHazards;
          $scope.condition = ra[0].condition;
          $scope.validLicense = ra[0].validLicense;
          console.log(ra[0].appuser);

          $scope.getEmployeeList = function(user){
            var type = ra[0].appuser.accessLevelType;
            console.log(type);
            switch (type) {
              case "Region":
                getRegionalEmployees(ra[0].appuser.accessLevelAreaId);
                break;
              case "Division":
                getDivisionalEmployees(ra[0].appuser.accessLevelAreaId);
                break;
              case "Project":
                getProjectEmployees(ra[0].appuser.accessLevelAreaId);
                break;
              case "Group":
                getGroupEmployees(ra[0].appuser.accessLevelAreaId);
                break;

            }//matches users access type and loads the corresponding data
          };
          function getRegionalEmployees(areaId){
            Employee.find({filter:{where:{regionId: areaId}}})
              .$promise.then(function(data){$scope.employeeList = data;})
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

          $scope.changeEmployee = function(selectedEmployeeId){
            var accessLevel = ra[0].appuser.accessLevelType;
            console.log(accessLevel);
            RiskAssessment.updateAttributes({id: ra[0].id, employeeId: selectedEmployeeId})
              .$promise.then(function(data){ $state.reload(); console.log(data)}).catch(function(err){console.error(err)})
          };
          if(ra[0].validLicense === true){
            $scope.driversLicense = "Verified";
          }else if (ra[0].validLicense === false){
            $scope.driversLicense = "Expired";
          }

          for(var h in ra[0].identifiedHazards){
            console.log(ra[0].identifiedHazards[h]);
            if(ra[0].identifiedHazards[h].reaction === "Safe"){
              $scope.safeReactions.push(h);
              console.log($scope.safeReactions.length);
            }
          }
          $scope.setWeatherCondition = function(id,condition){
            console.log(id, condition);
            setWeatherCondition(id,condition);
            function setWeatherCondition(id,condition){
              RiskAssessment.updateAttributes({id: id, condition: condition})
                .$promise.then(function(success){console.log(success);$state.reload();})
            }
          };

          var year = moment().year();
          $scope.months = [];
          $scope.dates = [];
          $scope.years = [];
          for (var x=0; x < 12; x++){var m = x+1; $scope.months.push(m)}
          for (var x=0; x < 31; x++){var d = x+1; $scope.dates.push(d)}
          for (var x=0; x <= 6; x++){var yr = year++; $scope.years.push(yr)}

          $scope.submitDriversLicense = function(m,d,y){

            var current = moment();
            m = m-1; //offset for zero index
            var date = new Date(y,m,d);

            if(moment(date).isBefore(current)){
              saveExpirationDate(ra[0].id,date, false);
              alert("This driver license is expired. Please notify management.");
            }else{
              saveExpirationDate(ra[0].id,date, true);
            }

            function saveExpirationDate(raId,date, licenseStatus){
              RiskAssessment.updateAttributes({id:raId, driversLicenseExpiration: date, validLicense: licenseStatus}).$promise.then(function(update){ $state.reload(); console.log(update, "Expiration date saved.")}).catch(function(err){console.error(err)})
            };
          };
          var duration = (Number(ra[0].phase1Timer)+ Number(ra[0].phase2Timer) + Number(ra[0].phase3Timer)) / 60000;
          $scope.duration = duration;
          var x = duration;

          $scope.deleteAssessment = function(id){
            console.log(id);
            RiskAssessment.destroyById({"id":id})
              .$promise
              .then(function(id){
                Timer.clear();
                console.log(id,"Risk Assessment succesfully deleted.");
                alert("Risk Assessment deleted.");
                $state.go('ra-mobile.main')
              })
              .catch(function(err,id){console.error(err, "Error deleting Risk Assessment",id)});
          };

          console.log(duration);
          RiskAssessment.updateAttributes({id:ra[0].id, phase:"Verification", duration: duration, "completed_on": moment()})
            .$promise
            .then(function(ra){})
            .catch(function(err){console.error(err)});

          $scope.identifiedHazards = [];
          ra[0].identifiedHazards.forEach(function(h){
            if(h.phase === "Recognize & React"){
              $scope.identifiedHazards.push(h);

            }
          });
          $scope.isDisabled = function(){

            if(ra[0].driversLicenseExpiration != null && ra[0].condition != null && ra[0].identifiedHazards.length > 0){
              return false;
            }
              return true;
          };
          $scope.reqsMet = function(){
            if(ra[0].driversLicenseExpiration != null && ra[0].condition != null && ra[0].identifiedHazards.length > 0){
              return true;            }
            return false;
          };
          $scope.complete = function(assessment,lat,lng){

            complete(assessment);

            function complete(assessment){

              $http.post('api/Riskassessments/verify', {"assessment":assessment})
                .then(function(success){console.log(success);
                  RiskAssessment.updateAttributes({id:assessment[0].id, location:{"lat": lat, "lng":lng},employee_verification: "sent",active: false})
                    .$promise
                    .then(function(success){console.log(success); $state.go('ra-mobile.main')})
                    .catch(function(err){console.error(err)});
                });
            };
          };
        });

    })
})();
