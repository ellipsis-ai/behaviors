function(sarcasmProbability, ellipsis) {
  "use strict"; 
const RandomResponse = require('ellipsis-random-response');
const isSarcastic = Math.random()*10 < sarcasmProbability;
const responseType = isSarcastic ? 'sarcastic' : 'appreciated';
ellipsis.success(RandomResponse.responseWithEmoji(responseType));
}
