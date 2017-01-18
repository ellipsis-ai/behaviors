function(ellipsis) {
  "use strict"; 
const RandomResponse = require('ellipsis-random-response');
const randomBananaCount = Math.max(10, Math.floor(Math.random() * 50));
ellipsis.success(`Go bananas??? Don't mind if I do...

${RandomResponse.emoji("celebratory", randomBananaCount)} ${RandomResponse.response("celebratory")}`);
}
