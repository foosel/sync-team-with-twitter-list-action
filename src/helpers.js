const github = require("@actions/github");
const Twitter = require("twitter");

Array.prototype.chunk = function (size) {
  const chunks = [];
  const count = Math.ceil(this.length / size);

  for (let i = 0, j = 0; i < count; i++, j += size) {
    chunks.push(this.slice(j, j + size));
  }

  return chunks;
};

async function getTeamMembers(client, org, team) {
  const query = `query { 
    organization(login: "${org}") {
      team(slug: "${team}") {
        members {
          nodes {
            twitterUsername
          }
        }
      }
    }
  }`;

  const response = await client.graphql({ query: query });

  const result = response.organization.team.members.nodes
    .map((x) => x.twitterUsername)
    .filter((x) => x !== null)
    .map((x) => x.toLowerCase());
  result.sort();
  return result;
}

async function getListMembers(client, list) {
  let result = [];
  let response;

  let cursor = -1;
  do {
    response = await client.get("lists/members", {
      list_id: list,
      count: 100,
      cursor: cursor,
    });

    result = result.concat(
      response.users.map((x) => x.screen_name.toLowerCase())
    );
    cursor = response.next_cursor;
  } while (cursor !== 0);

  result.sort();
  return result;
}

async function addListMembers(client, list, members, dryRun) {
  for await (chunk of members.chunk(100)) {
    const screen_name = members.join(",");
    console.log(`Adding members ${screen_name}`);
    if (!dryRun) {
      await client.post("/lists/members/create_all", {
        list_id: list,
        screen_name: screen_name,
      });
    }
  }
}

async function removeListMembers(client, list, members, dryRun) {
  for await (chunk of members.chunk(100)) {
    const screen_name = members.join(",");
    console.log(`Removing members ${screen_name}`);
    if (!dryRun) {
      await client.post("/lists/members/destroy_all", {
        list_id: list,
        screen_name: screen_name,
      });
    }
  }
}

async function syncListMembers(client, list, members, dryRun) {
  const currentMembers = await getListMembers(client, list);
  console.log("Twitter list members", currentMembers);

  const toAdd = members.filter((x) => !currentMembers.includes(x));
  const toRemove = currentMembers.filter((x) => !members.includes(x));
  console.log("Members to add", toAdd);
  console.log("Members to remove", toRemove);

  await addListMembers(client, list, toAdd, dryRun);
  await removeListMembers(client, list, toRemove, dryRun);
}

async function synchronize(
  githubToken,
  twitterConsumerKey,
  twitterConsumerSecret,
  twitterAccessKey,
  twitterAccessSecret,
  team,
  list,
  dryRun
) {
  const githubClient = github.getOctokit(githubToken);
  const twitterClient = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: twitterAccessKey,
    access_token_secret: twitterAccessSecret,
  });
  const [org, teamslug] = team.split("/", 2);

  if (dryRun) {
    console.log("Dryrun is enabled, no modifications will be done!");
  }

  const members = await getTeamMembers(githubClient, org, teamslug);
  console.log("GitHub team members", members);

  await syncListMembers(
    twitterClient,
    list,
    members.map((x) => x.toLowerCase()),
    dryRun
  );
}

exports.getTeamMembers = getTeamMembers;
exports.getListMembers = getListMembers;
exports.addListMembers = addListMembers;
exports.removeListMembers = removeListMembers;
exports.syncListMembers = syncListMembers;
exports.synchronize = synchronize;
