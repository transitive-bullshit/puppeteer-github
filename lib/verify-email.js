'use strict'

const PuppeteerEmail = require('puppeteer-email')
const cheerio = require('cheerio')
const pRetry = require('p-retry')

module.exports = async (browser, user, opts = { }) => {
  const client = new PuppeteerEmail(user.email)

  const session = await client.signin(user, {
    ...opts,
    browser
  })

  // TODO: checking for a valid email should be part of the retry loop
  const emails = await pRetry(async () => session.getEmails({
    query: 'from:noreply@github.com please verify'
  }), {
    retries: 4
  })

  // console.log(JSON.stringify(emails, null, 2))
  const validEmails = emails
    .filter((email) => email && email.html)

  if (validEmails.length) {
    const email = validEmails[0]
    const $ = cheerio.load(email.html)
    const url = $('a.cta-button').attr('href')

    const page = await browser.newPage()
    await page.goto(url)

    // "Your email was verified." OR "<email> is already verified."
    // const flash = page.$('#js-flash-container', $el => $el.textContent.trim())
    // if (flash && /verified/i.test(flash))

    await page.close()
  } else {
    throw new Error(`unable to find verification email for "${user.email}"`)
  }
}
