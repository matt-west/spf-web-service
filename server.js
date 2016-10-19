var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var SPFService = require('./lib/spf_service.js');

app.use( bodyParser.json() );

app.post('/', function (req, res) {
  var domain = req.body.domain;

  if (!domain) {
    return res.status(400).json({
      status: 400,
      message: 'Please specify a domain.'
    });
  }

  // Ensure there's no protocol on the domain.
  domain = domain.replace('https://', '').replace('http://', '');

  SPFService.updateRecord(domain, 'spf.mtasv.net', function(result) {
    res.json({
      status: 200,
      domain: domain,
      operation: result.operation,
      spf: result.record
    });
  });
});

app.listen(8000, function () {
  console.log('Started listening on port 8000!');
});
