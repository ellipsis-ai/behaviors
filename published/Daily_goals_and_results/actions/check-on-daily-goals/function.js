function(ellipsis) {
  const postMessage = require('ellipsis-post-message').postMessage;

function hasGoalsAlready(response) {
  const body = JSON.parse(response.body)[0];
  return body != "You haven't yet said what you need to achieve for today to be successful\n";
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
       setTimeout(() => ellipsis.success("Let’s check in again tomorrow morning."), 500);
    }
  },
  error: ellipsis.error
});
}
