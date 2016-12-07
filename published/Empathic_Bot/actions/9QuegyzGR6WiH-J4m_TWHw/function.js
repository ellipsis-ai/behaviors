function(ellipsis) {
  "use strict"; 

const possibleEmoji = [
  ":balloon:",
  ":champagne:",
  ":tada:",
  ":confetti_ball:",
  ":clap: :clap: :clap:",
  ":100:"
];

const possibleWords = [
  "Yay!",
  "Hurray!",
  "yessssssss"
];

function randomEmoji(numEmoji) {
  let emoji = '';
  for (let i = 0; i < numEmoji; i++) {
    emoji += possibleEmoji[Math.floor(Math.random() * possibleEmoji.length)];
  }
  return emoji;
}

function randomWord() {
  return possibleWords[Math.floor(Math.random() * possibleWords.length)];
}

const randomBananaCount = Math.max(10, Math.floor(Math.random() * 50));
ellipsis.success(`Go bananas??? Don't mind if I do...

${randomEmoji(randomBananaCount)} ${randomWord()}`);
}
