function(ellipsis) {
  const GitHubApi = require("github");
const github = new GitHubApi();

github.authenticate({
  type: "oauth",
  token: ellipsis.accessTokens.github
});

github.repos.getAll({}, function(err, res) {
  if (err) {
    ellipsis.error(err.toString());
  } else {
    ellipsis.success(res.data.map((ea) => {
      return { id: ea.full_name, label: ea.full_name };
    }));
  }
});
}
