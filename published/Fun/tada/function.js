function(onSuccess, onError, ellipsis) {
  var possibleEmoji = [
  ":balloon:",
  ":champagne:",
  ":tada:",
  ":confetti_ball:",
  ":clap: :clap: :clap:",
  ":100:"
];

var possibleWords = [
  "Yay!",
  "Hurray!",
  "yessssssss"
];

var randomEmoji = Math.floor(Math.random() * possibleEmoji.length);
var randomWord = Math.floor(Math.random() * possibleWords.length);

onSuccess({
  emoji: possibleEmoji[randomEmoji],
  word: possibleWords[randomWord]
});
}