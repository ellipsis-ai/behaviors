function(word, ellipsis) {
  var scraperjs = require('scraperjs');
var dictionaryURL = "http://www.webster-dictionary.org/definition/";
var qp = encodeURI(word);
var requestURL = dictionaryURL + qp;

scraperjs.StaticScraper.create(requestURL)
  .scrape(function($) {
    var mapContent = function() {
      var text = $(this).text();
      switch (this.tagName) {
        case 'div':
          return '\n\n' + $(this).contents().map(mapContent).get().join('') + '\n\n';
        case 'b':
          return '**' + text + '**';
        default:
          return text;
      }
    };

    return $('tr').map(function() {
      return $(this).find('td').map(function() {
        return $(this).contents().map(mapContent).get().join('');
      }).get().join(' ');
    }).get();
  })
  .then(function(results) {
    ellipsis.success(results);
  });


}
