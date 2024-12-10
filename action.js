const core = require('@actions/core')
const github = require('@actions/github')
const process = require('process')

const customRepo = (repoPath) => {
  const segments = repoPath.split('/', 2)

  if (segments.length < 2) {
    core.info('Please provide a repository in the format `owner/repo`.')
  }

  return segments
}

const repoInput = core.getInput('repo_path')

const [owner, repo] = repoInput
  ? customRepo(repoInput)
  : process.env['GITHUB_REPOSITORY'].split('/', 2)

const octokit = new github.GitHub(
  core.getInput('github_token', { required: true })
)

async function run() {
  let latestRelease

  core.info(`Fetching the latest release for \`${owner}/${repo}\``)

  try {
    latestRelease = await octokit.repos.getLatestRelease({
      owner,
      repo,
    })
  } catch (error) {
    core.info('Could not fetch the latest release. Have you made one yet?')
    core.setFailed(error)
  }

  const { data } = latestRelease

  core.exportVariable('release_url', data.url)
  core.exportVariable('release_assets_url', data.assets_url)
  core.exportVariable('release_upload_url', data.upload_url)
  core.exportVariable('release_html_url', data.html_url)
  core.exportVariable('release_id', data.id.toString())
  core.exportVariable('release_node_id', data.node_id)
  core.exportVariable('release_tag_name', data.tag_name)
  core.exportVariable('release_target_commitish', data.target_commitish)
  core.exportVariable('release_name', data.name)
  core.exportVariable('release_body', data.body)
  core.exportVariable('release_draft', data.draft)
  core.exportVariable('release_prerelease', data.prerelease)
  core.exportVariable('release_author_id', data.author.id.toString())
  core.exportVariable('release_author_node_id', data.author.node_id)
  core.exportVariable('release_author_url', data.author.url)
  core.exportVariable('release_author_login', data.author.login)
  core.exportVariable('release_author_html_url', data.author.html_url)
  core.exportVariable('release_author_type', data.author.type)
  core.exportVariable('release_author_site_admin', data.author.site_admin)
}

try {
  run()
} catch (error) {
  core.setFailed(`Action failed with error ${error}`)
}
