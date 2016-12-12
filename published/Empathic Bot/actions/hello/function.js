function(ellipsis) {
  var possibleGreetings = [
  "Well hello there.",
  "Hi",
  "Hi!",
  "Hello",
  "Greetings",
  "Howdy",
  "Hey there"
];

var randomGreeting = Math.floor(Math.random() * possibleGreetings.length);

ellipsis.success(possibleGreetings[randomGreeting]);



}
