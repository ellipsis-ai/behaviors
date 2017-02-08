function(ellipsis) {
  const postMessage = require('ellipsis-post-message').postMessage;

function hasGoalsAlready(response) {
  const body = JSON.parse(response.body)[0];
  return body != "It looks like you didn’t set a goal for today.\n";
}

postMessage({ 
  message: "remind me of my goals for today",
  ellipsis: ellipsis,
  success: response => {
    if (hasGoalsAlready(response)) {        
      postMessage({
        message: "ask me how my day went", 
        ellipsis: ellipsis,
        success: response => {
          ellipsis.noResponse()
        },
        error: ellipsis.error
      });
    } else {
      setTimeout(() => ellipsis.success("Let’s check in again tomorrow morning."), 200);
    }
  },
  error: ellipsis.error
});

}
