var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var SPFService = require('./lib/spf_service.js');

app.use(bodyParser.json());

app.post('/', function (req, res) {
  var domain = req.body.domain,
      serviceSpf = req.body.service_spf,
      errors = [];

  /**
   * Basic Request Validation
   */
  if (!domain) {
    errors.push('Please specify a valid domain.');
  }

  if (!serviceSpf) {
    errors.push('Please specify the service SPF record.');
  }

  if (errors.length) {
    return res.status(400).json({
      errors: errors
    });
  }

  // Ensure there's no protocol on the domain.
  domain = domain.replace('https://', '').replace('http://', '');

  /**
   * Check the DNS and respond with the modified SPF record.
   */
  SPFService.updateRecord(domain, serviceSpf, function(operation, record) {
    res.status(200).json({
      domain: domain,
      operation: operation,
      record: record
    });
  }, function(errors) {
    res.status(500).json({
      errors: [ 'Whoops! An error occured. Make sure you specified a valid domain name.' ]
    });
  });
});


/**
 * Start the web server.
 */
var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Started listening on port ' + port + '!');
});
