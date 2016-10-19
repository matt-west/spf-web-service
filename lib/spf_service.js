const dns = require('dns'),
      _ = require('underscore');

var SPFService =  {

  updateRecord: function(domain, targetSpf, callback) {
    console.log('Generating SPF record for:', domain);

    dns.resolveTxt(domain, function(error, records) {
      if (error) {
        return callback({
          operation: 'error'
        });
      }

      var spfRecord = _.find(records, function(record){
        return record[0].indexOf('v=spf1') > -1;
      });

      // If there is not SPF record present just return the standard record.
      if (!spfRecord) {
        return callback({
          operation: 'new',
          record: 'v=spf1 a mx include:' + targetSpf + ' ~all'
        });
      }

      // If Postmark is already present, return the existing record.
      if (spfRecord[0].indexOf(targetSpf) > -1) {
        return callback({
          operation: 'not-modified',
          record: spfRecord[0]
        });
      }

      // Otherwise, parse the SPF record and insert the postmark domain.
      var segments = spfRecord[0].split(' ');

      for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];

        // Search for the first domain listing in the record.
        if (segment.indexOf('include:') > -1) {

          // Insert the postmark domain.
          segments.splice(i, 0, 'include:' + targetSpf);
          break;
        }
      }

      // Re-construct the record.
      return callback({
        operation: 'modified',
        record: segments.join(' ')
      });
    });

  }

};

module.exports = SPFService;
