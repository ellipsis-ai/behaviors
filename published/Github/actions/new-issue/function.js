function(title, body, repo, ellipsis) {
  const GitHubApi = require("github");
const github = new GitHubApi();

github.authenticate({
  type: "oauth",
  token: ellipsis.accessTokens.github
});

const owner = repo.id.split("/")[0];
const repoName = repo.id.split("/")[1];
github.issues.create({
  owner: owner,
  repo: repoName,
  title: title,
  body: body
}, function(err, res) {
  if (err) {
    ellipsis.error(err.toString());
  } else {
    ellipsis.success(res.data)
  }
});
}
