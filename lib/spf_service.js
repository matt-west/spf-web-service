const dns = require('dns'),
      _ = require('underscore');

var SPFService =  {

  /**
   *  Check a domain names SPF record and add the serviceSpf if needed.
   *
   * @param  {String}   domain            The target domain.
   * @param  {String}   serviceSpf        The SPF record for the service.
   * @param  {Function} successCallback   Called if the operation is successful.
   * @param  {Function} errorCallback     Called if there is an error.
   * @return {Function}                   The appropriate callback function.
   */
  updateRecord: function(domain, serviceSpf, successCallback, errorCallback) {
    console.log('Generating SPF record for:', domain);

    dns.resolveTxt(domain, function(error, records) {
      if (error) {
        return errorCallback(error);
      }

      var spfRecord = _.find(records, function(record){
        return record[0].indexOf('v=spf1') > -1;
      });

      // If there is not SPF record present just return the standard record.
      if (!spfRecord) {
        return successCallback('create', 'v=spf1 a mx include:' + serviceSpf + ' ~all');
      }

      // If Postmark is already present, return the existing record.
      if (spfRecord[0].indexOf(serviceSpf) > -1) {
        return successCallback('existing', spfRecord[0]);
      }

      // Otherwise, parse the SPF record and insert the postmark domain.
      var segments = spfRecord[0].split(' ');

      for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];

        // Search for the first domain listing in the record.
        if (segment.indexOf('include:') > -1) {

          // Insert the postmark domain.
          segments.splice(i, 0, 'include:' + serviceSpf);
          break;
        }
      }

      // Re-construct the record.
      return successCallback('modify', segments.join(' '));
    });

  }

};

module.exports = SPFService;
