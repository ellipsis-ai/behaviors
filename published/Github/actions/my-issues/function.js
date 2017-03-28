function(ellipsis) {
  const groupBy = require('group-by');
const GitHubApi = require("github");
const github = new GitHubApi();

github.authenticate({
  type: "oauth",
  token: ellipsis.accessTokens.github
});

github.issues.getAll({
  filter: "assigned"
}, function(err, res) {
  if (err) {
    ellipsis.error(err.toString());
  } else {
    const grouped = groupBy(res.data, "repository_url");
    const groupedArray = Object.keys(grouped).map(repo => {
      return { repo: repo, issues: grouped[repo] }
    });
    ellipsis.success(groupedArray);
  }
});
}
