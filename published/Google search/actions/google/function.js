function(
input,
ellipsis
) {
  var scraperjs = require('scraperjs');

scraperjs.StaticScraper.create('https://www.google.com/search?q=' + input)
	.scrape(function($) {
		return $(".r a").map(function() {
      var text = $(this).text();
      var link = $(this).attr("href") || "";
      link = link.replace(/\/url\?q=/, "");
      link = link.replace(/&sa=.*/, "");
			return  { link: link, text: text };
		}).get();
	})
	.then(function(resultArray) {
    var filtered = resultArray.filter(function(ea) { 
      return !(/^\/search/.test(ea.link)); 
    });
    ellipsis.success(filtered);
	})
}