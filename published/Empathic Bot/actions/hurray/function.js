function(ellipsis) {
  var possibleEmoji = [
  ":balloon:",
  ":champagne:",
  ":tada:",
  ":confetti_ball:",
  ":clap: :clap: :clap:",
  ":100:",
  ":trumpet:"
];

var possibleWords = [
  "Yay!",
  "Hurray!",
  "yessssssss",
  "WOOT!",
  "Huzzah"
];

var randomEmoji = Math.floor(Math.random() * possibleEmoji.length);
var randomWord = Math.floor(Math.random() * possibleWords.length);

ellipsis.success({
  emoji: possibleEmoji[randomEmoji],
  word: possibleWords[randomWord]
});

}
