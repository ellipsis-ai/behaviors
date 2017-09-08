function(advertisableEID, dateRange, ellipsis) {
  const AdRollHelper = require('./adroll');
const adRoll = new AdRollHelper(ellipsis);
const dateRangeParser = require('ellipsis-date-range-parser');

const parsedRange = dateRangeParser.parse(dateRange, ellipsis.teamInfo.timeZone);

const inputs = {
  advertisableEID: advertisableEID,
  dateRange: parsedRange
};

adRoll.validateAPIisReacheable()
  .then(() => adRoll.validateAdvertisableEID(advertisableEID))
  .then(() => adRoll.validateDateRange(parsedRange, dateRange))
  .then(() => adRoll.getReportRecords(inputs))
  .then((result) => {
  
    // Creates a CSV file to send to the user
    
    const reportType = "AM";
    const start = inputs.dateRange.start.toISOString().slice(0,10);
    const end = inputs.dateRange.end.toISOString().slice(0,10);
    if (result.records.length > 0 ){
       const filename = ["report", reportType, start, end].join("_") + ".csv";
       const files = [{
         content: result.records.join('\n'),
         filetype: "csv",
         filename: filename
        }];
        ellipsis.success(`I  have found ${result.records.length} records from ${start} to ${end}`, { files: files });
    } else {
      ellipsis.success(`I did not get back any records for EID ${advertisableEID} between ${start} and ${end}`); 
    }
});
}
