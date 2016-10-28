function(ellipsis) {
  /* Set sarcasm probablity from 0 to 1 as suits your colleagues
   where 0 is “We are the nicest people on Earth”
   and 1 is “We are all jerks" */

const sarcasmProbability = 0.5;

const genuineResponses = [
  "Oh, my pleasure.",
  "I do what I can.",
  "It was nothing, really.",
  "Don’t mention it.",
  "You’re welcome.",
  ":grinning:",
  ":thumbsup:"
];

const sarcasticResponses = [
  "You’re welcome… I think?",
  "I can’t tell if you’re being sincere, but… no worries.",
  ":grimacing:",
  "Welp",
  "¯\\_(ツ)_/¯",
  "_cough_",
  ":see_no_evil:",
  "Moving right along…"
];

const isSarcastic = Math.random() < sarcasmProbability;
const responses = isSarcastic ? sarcasticResponses : genuineResponses;
const random = Math.round(Math.random() * (responses.length - 1));
ellipsis.success(responses[random]);
}
