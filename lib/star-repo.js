'use strict'

const delay = require('delay')
const parseGithubUrl = require('parse-github-url')

module.exports = async (browser, repo, opts) => {
  const parsed = parseGithubUrl(repo)
  const url = `https://github.com/${parsed.repository}`

  const page = await browser.newPage()
  await page.goto(url)

  const isStarred = await page.$eval('.starred button', $el => $el.offsetHeight > 0)

  if (!isStarred) {
    await page.click('.unstarred button')
    await delay(500)
  }

  await page.close()
}
