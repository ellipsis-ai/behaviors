function(ellipsis) {
  const postMessage = require('ellipsis-post-message').postMessage;

postMessage({
  message: "...good morning",
  ellipsis: ellipsis,
  success: (response1) => {
    postMessage({ 
      message: "how have my goals gone",
      ellipsis: ellipsis,
      success: (response2) => {
        postMessage({
          message: "ask me about my goals for today",
          ellipsis: ellipsis,
          success: (response3) => {
            ellipsis.noResponse()
          },
          error: ellipsis.error
        });
      },
      error: ellipsis.error
    });
  },
  error: ellipsis.error
});
}
