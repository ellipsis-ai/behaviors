function(repo, ellipsis) {
  const GitHubApi = require("github");
const github = new GitHubApi();

github.authenticate({
  type: "oauth",
  token: ellipsis.accessTokens.github
});

const owner = repo.id.split("/")[0];
const repoName = repo.id.split("/")[1];
github.pullRequests.getAll({
  owner: owner,
  repo: repoName
}, function(err, res) {
  if (err) {
    ellipsis.error(err.toString());
  } else {
    const msg =
      res.data.length === 0 ?
        `No open PRs for the **${repo.label}** repo. Go for a walk or something.` :
        `PRs open at the moment for the **${repo.label}** repo:`;
    ellipsis.success({ msg: msg, prs: res.data });
  }
});
}
