const core = require("@actions/core");
const { synchronize } = require("./helpers");

async function runAsAction() {
  try {
    const githubToken = core.getInput("github-token", { required: true });
    const twitterConsumerKey = core.getInput("twitter-consumer-key", {
      required: true,
    });
    const twitterConsumerSecret = core.getInput("twitter-consumer-secret", {
      required: true,
    });
    const twitterAccessKey = core.getInput("twitter-access-key", {
      required: true,
    });
    const twitterAccessSecret = core.getInput("twitter-access-secret", {
      required: true,
    });
    const dryRun = core.getInput("dry-run") || false;
    const orgteam = core.getInput("github-team", { required: true });
    const list = core.getInput("twitter-list", { required: true });

    await synchronize(
      githubToken,
      twitterConsumerKey,
      twitterConsumerSecret,
      twitterAccessKey,
      twitterAccessSecret,
      orgteam,
      list,
      dryRun
    );
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

async function runLocally() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
    const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
    const twitterAccessKey = process.env.TWITTER_ACCESS_KEY;
    const twitterAccessSecret = process.env.TWITTER_ACCESS_SECRET;
    const dryRun = process.env.DRYRUN || false;
    const orgteam = process.env.GITHUB_TEAM;
    const list = process.env.TWITTER_LIST;

    await synchronize(
      githubToken,
      twitterConsumerKey,
      twitterConsumerSecret,
      twitterAccessKey,
      twitterAccessSecret,
      orgteam,
      list,
      dryRun
    );
  } catch (error) {
    console.log(error);
  }
}

if (process.env.GITHUB_WORKFLOW) {
  // running as a GitHub Action
  runAsAction();
} else {
  // run standalone
  runLocally();
}
