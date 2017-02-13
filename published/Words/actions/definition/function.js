function(word, ellipsis) {
  // word-definition pulls a definition from wiktionary.org
const define = require('word-definition');
define.getDef(word, 'en', null, (result) => {
  if (result.err) {
    switch (result.err) {
      case "invalid characters":
        ellipsis.error("Sorry, I can only find definitions for single words without spaces or punctuation.");
        return;
      case "not found":
        ellipsis.error("Sorry, I couldn’t find that word.");
        return;
      default:
        ellipsis.error(result.err);
        return;
    }
  } else {
    ellipsis.success(result);
  }
});
}
