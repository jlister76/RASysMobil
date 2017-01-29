var app = require('../server');

module.exports = function(router) {

  // Install a "/ping" route that returns "pong"
  router.get('/api/riskassessments/:id/verified', function(req, res) {
    var id = req.params.id;

    console.log(id);

    app.models.RiskAssessment.findById(id,function(err,data){
      if(err){console.error(err)}
      console.log(data);
      data.updateAttribute("employee_verification", true, function(err,update){
       if(err){console.error(err)}
       console.log(update,"Instances updated successfully.");
       })
    });
    res.render('verified');
  });
};
