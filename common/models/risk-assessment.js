'use strict';
var http = require("http");
var loopback = require("loopback");
var app = require('../../server/server');
var path = require('path');
var moment = require('moment');
var host = app.get('host');
var port = app.get('port');


module.exports = function(Riskassessment) {

  // send an email
  Riskassessment.sendEmail = function(ra, cb) {

  //console.log(ra[0].id);
  var id = ra[0].id,
    user = ra[0].appuser,
    employee = ra[0].employee,
    hazards = ra[0].identifiedHazards,
    completed_on = moment().format('dddd, MMM Do YYYY'),
    conditions = ra[0].condition,
    evaluation = [], recognize =[],
    key = process.env.MAP_KEY,
    url = app.get('url').replace(/\/$/, '');
console.log("RiskAssessment.js ", url,host,port);

  for(var i=0; i<hazards.length; i++){
    if(hazards[i].phase === "Evaluation"){
      evaluation.push(hazards[i]);
    } else if(hazards[i].phase === "Recognize & React"){
      recognize.push(hazards[i]);
    }
  }

    // create a custom object your want to pass to the email template. You can create as many key-value pairs as you want
    var messageVars = {host:host, port: port, url: url, id: id, user: user, employee: employee, evaluation: evaluation, recognize:recognize, date: completed_on,conditions: conditions,key:key};

    // prepare a loopback template renderer
    var renderer = loopback.template(path.resolve(__dirname, '../../server/views/email-template.ejs'));
    var html_body = renderer(messageVars);

    Riskassessment.app.models.Email.send({
      to: 'jlister76@gmail.com',
      from: 'jlister469@outlook.com',
      subject: 'Risk Assessment - Verification',
      html: html_body
    }, function(err, mail) {
      if(err){console.error(err)}
      console.log('email sent!');

    });
  };


  Riskassessment.verify = function(a,next){

    Riskassessment.sendEmail(a);
    next();
  };

  Riskassessment.remoteMethod('verify', {
    accepts: {arg: 'assessment', type: 'array'},
    http: {path: '/verify', verb: 'post'}
  });
};
