function(taskName, dueDate, project, ellipsis) {
  "use strict";

const request = require('request');
const uuid = require('uuid');
const apiUrl = "https://todoist.com/API/v7/sync";
const token = ellipsis.accessTokens.todoist;

const tempId = uuid.v4();
request.post(
  apiUrl,
  {
    form: {
      token: token,
      commands: JSON.stringify([
        {
          uuid: uuid.v4(),
          temp_id: tempId,
          type: "item_add",
          args: {
            content: taskName,
            date_string: dueDate,
            labels: [],
            project_id: project.id
          }
        }
      ])
    }
  },
  function (error, response, body) {
    if (error) {
      ellipsis.error(error);
    } else if (response.statusCode != 200) {
      ellipsis.error(response.statusCode + ": " + response.body);
    } else {
      const newItemId = JSON.parse(body).temp_id_mapping[tempId];
      ellipsis.success(newItemId)
    }
  }
);
}
