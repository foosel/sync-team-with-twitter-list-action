# 🐦 Sync GitHub team with Twitter list

This action syncs members of a GitHub team (who have listed their Twitter handle in their profile) to a Twitter list.

You probably want to run this regularly via `schedule` and maybe also manually via `workflow_dispatch`.

## Prerequisits

You'll need to create a Twitter app associated with the account that the target lists belongs to. Go to https://developer.twitter.com/en/apps for that.

You'll also need to create a GitHub personal access token for an account that's a member of the team's organization with the `org:read` permission. See https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token on how to do that.

You should add all the credentials as secrets to your workflow's repository.

## Inputs

### `github-token`

**Required** The GitHub PAT to use. 

### `twitter-consumer-key`

**Required** Twitter consumer key, can be found in the Twitter app under "Keys and tokens"

### `twitter-consumer-secret`

**Required** Twitter consumer secret, can be found in the Twitter app under "Keys and tokens"

### `twitter-access-key`

**Required** Twitter access token key, can be found in the Twitter app under "Keys and tokens"

### `twitter-access-secret`

**Required** Twitter access token secret, can be found in the Twitter app under "Keys and tokens"

### `github-team`

**Required** GitHub team designator in the format `<organization>/<teamslug>`.

### `twitter-list`

**Required** 'Twitter list ID with which to sync'. Can be found in the URL of the list, e.g. for `https://twitter.com/i/lists/1326562334312189957` it will be `1326562334312189957`.

### `dry-run`

If set, no actual action will be performed, the action will perform a dry-run only.

## Usage

``` yaml
- uses: foosel/sync-team-with-twitter-list-action@main
  with:
    github-token: ${{ secrets.TEAM_MEMBER_TOKEN }}
    twitter-consumer-key: ${{ secrets.TWITTER_CONSUMER_KEY }}
    twitter-consumer-secret: ${{ secrets.TWITTER_CONSUMER_SECRET }}
    twitter-access-key: ${{ secrets.TWITTER_ACCESS_KEY }}
    twitter-access-secret: ${{ secrets.TWITTER_ACCESS_SECRET }}
    github-team: <organization>/<teamslug>
    twitter-list: <listid>
```

See this repository's `` workflow for a full usage example.
