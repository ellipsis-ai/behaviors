/*
Simple methods to handle interaction with the AdRoll GraphQL API
@exportId W1PqDGz3Sca22A5aCX1mow
*/
module.exports = (function() {
const graphqlRequest = require('graphql-request');

// Takes a list of AdRoll Campaign objects and create an
// array of csv records.
function extractAMReportRecords(campaigns) {
  var records = [];
  campaigns.forEach((c) => {
    c.adgroups.forEach((adGroup) => {
      adGroup.ads.forEach((ad) => {
        ad.metrics.byDate.forEach((m) => {
          records.push(
            [
              m.date,
              (new Date(m.date)).toLocaleString('en-us', {weekday: 'long'}),
              c.type || "",
              c.channel || "",
              c.name,
              adGroup.name,
              ad.status,
              ad.name,
              ad.width + "x" + ad.height,
              ad.type,
              m.cost,
              m.impressions,
              m.clicks,
              m.viewThroughs || "",
              m.clickThroughs || "",
              m.viewRevenue || "",
              m.clickRevenue || ""
            ].join()
          );
        });
      });
    });
  });
  return records;
}

class Adroll {
  
  constructor(ellipsis) {
    this.ellipsis = ellipsis;
    this.graphQL = this.buildGraphQLClient(this.ellipsis.accessTokens.adRollApp);
  }
  
  handleAPIError(response, options={}) {
    var whileDoing= options.whileDoing || "talking to the AdRoll API.";
    var message= options.message || "The API returned";
    var userMessage = `Something went wrong while ${whileDoing}`;
    var detailedMessage = message;
    
    if (response.name === 'FetchError') {
      detailedMessage = response.message;
    } else if (response.status == 200) {
      console.log("GraphQL error!");
      console.log(JSON.stringify(response));
      detailedMessage = options.message || "Something went wrong while quering the GraphQL API. Check your queries.";
      detailedMessage = detailedMessage + `\n GraphQL error: ${response.response.errors[0].message}`;
    } else {
      const errorMessage = (response.errors && response.errors.length) ? response.errors[0].message: "No details provided";
      detailedMessage = `${message} ${response.status}: ${errorMessage}`;
    }
    userMessage = `${userMessage}\n
More details:  
\`\`\`
${detailedMessage}
\`\`\`
`
    throw new this.ellipsis.Error(detailedMessage, {userMessage: userMessage})
  }

  buildGraphQLClient(oauth2Token) {
    const endpoint  = 'https://services.adroll.com/reporting/api/v1/query';
    const authHeaderValue = "Bearer " + oauth2Token;
    return new graphqlRequest.GraphQLClient(endpoint, {
      headers: { Authorization: authHeaderValue }
    });
  }

  validateAPIisReacheable() {
    const query = `query { organization { current { name } } }`;
    return this.graphQL.request(query)
      .catch((response) => {
        this.handleAPIError(response.response);
      });
  }

  validateAdvertisableEID(advertisableEID) {
    const query = `{
      advertisable {
        byEID(advertisable: $advertisableEID) {
          organization
        }
      }
    }`;
    const variables = {
      advertisableEID: advertisableEID
    };
    return this.graphQL.request(query, variables)
      .catch((response) => {
        this.handleAPIError(response.response, {
          whileDoing: "validating the EID", 
          message: `The EID ${advertisableEID} is invalid.`
        });
      });
  }

  validateDateRange(dateRange, userInput) {
    return new Promise((resolve, reject) => {
      if (!dateRange) {
        reject(new this.ellipsis.Error(`The date range "${userInput}" is invalid`, { userMessage: "User will see this", errors:  ["A valid date range cannot be parsed."], errorType: "DATE_RANGE_ERROR"}));
      }

      var errors = [];
      if (!dateRange.start) {
        errors.push("start date is not defined");
      }
      if (!dateRange.end){
        errors.push("end date is not defined");
      }
      if (dateRange.start && dateRange.end && (dateRange.start > dateRange.end) ) {
        errors.push("Start date cannot be greater then end date");
      }
      if (errors.length > 0) {
        reject(new this.ellipsis.Error(`The date range "${userInput}" is invalid`, { userMessage: "User will see this", errors:  ["A valid date range cannot be parsed."], errorType: "DATE_RANGE_ERROR"}));
      }

      resolve();
    });
  }

  getReportRecords(inputs) {
    const csvHeaders = [
      "date",
      "day_of_week",
      "product",
      "inventory_source",
      "campaign",
      "adgroup",
      "status",
      "ad",
      "ad_size",
      "type",
      "cost",
      "impressions",
      "clicks",
      "adjusted_total_conversions",
      "adjusted_ctc",
      "adjusted_vtc",
      "attributed_rev",
      "attributed_click_through_rev",
      "attributed_view_through_rev"
    ].join(",");

    const query = `{
      advertisable {
        byEID(advertisable: $advertisableEID) {
          eid
          name
          campaigns {
            name
            adgroups {
              name
              ads {
                name
                status
                type
                height
                width
                adFormatName
                metrics(start: $startDate, end: $endDate, currency: "USD") {
                  byDate {
                    impressions
                    clicks
                    cost
                    viewThroughs
                    clickThroughs
                    viewRevenue
                    clickRevenue
                    date
                  }
                }
              }
            }
          }
        }
      }
    }`;
    const variables = {
      advertisableEID: inputs.advertisableEID,
      startDate: inputs.dateRange.start.toISOString().slice(0,10),
      endDate: inputs.dateRange.end.toISOString().slice(0,10)
    };

    return this.graphQL.request(query, variables)
      .then((data) => {
         return {
           records: [csvHeaders].concat(extractAMReportRecords(data.advertisable.byEID.campaigns))
         };
      })
      .catch((response) => {
        this.handleAPIError(response.response, {whileDoing: "fetching the AM Report records"});
      });
  }

  getOrgInfo(inputs) {
    var byWhat = "current";
    var variables = {};
    if (inputs.organizationEID) {
      byWhat = `byEID(organization: $organizationEID)`;
      variables = {organizationEID: inputs.organizationEID};
    }
    var query = `query { 
      organization { 
        ${byWhat} {  
          name
          eid
          createdDate
          advertisables {
            eid
            name
          }
          campaigns(isActive: true) {
            eid
            name
          }  
        }
       }
    }`;
    return this.graphQL.request(query, variables)
               .then(data => data.organization.byEID || data.organization.current)
               .catch(response => {
                 this.handleAPIError(response.response, {whileDoing: "fetching the Organization info"});
               });
  }
}

return Adroll;

})()
     