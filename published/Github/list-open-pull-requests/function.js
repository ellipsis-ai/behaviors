function(
repo,
ellipsis
) {
  const fetch = require("fetch");
const githubToken = ellipsis.accessTokens.github;
const githubOwner = ellipsis.env.GITHUB_OWNER;
const apiUrl = `https://api.github.com/repos/${githubOwner}/${repo}/pulls?access_token=${githubToken}&state=open`;

fetch.fetchUrl(apiUrl, {}, (error, meta, body) => {
  if (error) {
    ellipsis.error(error);
  } else if (meta.status == 200) {
    const prs = JSON.parse(body.toString()).slice(0,9);
    const msg = 
          prs.length === 0 ? 
            `No open PRs for the **${repo}** repo. Go for a walk or something.` : 
            `PRs open at the moment for the **${repo}** repo:`;
    ellipsis.success({ msg: msg, prs: prs }); 
  } else {
    ellipsis.error("Error: " + body.toString()); 
  }
});


}