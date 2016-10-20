var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    marked = require('marked'),
    fs = require('fs'),
    SPFService = require('./lib/spf_service.js');

// Enable CORS
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());

app.get('/', function(req, res) {
  fs.readFile('README.md', 'utf8', function (err, data) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(marked(data));
  });
});

app.post('/update-spf', function (req, res) {
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
