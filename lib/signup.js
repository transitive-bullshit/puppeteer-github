'use strict'

const PRIMARY_BUTTON = 'button[type=submit].btn-primary'

module.exports = async (browser, user, opts) => {
  const page = await browser.newPage()
  await page.goto('https://github.com/')

  // username / email / password
  // ---------------------------

  // await page.waitForNavigation({ timeout: 0 })
  await page.waitFor('input[id="user[login]"]', { visible: true })
  await page.type('input[id="user[login]"]', user.username)
  await page.type('input[id="user[email]"]', user.email)
  await page.type('input[type=password]', user.password)
  await Promise.all([
    page.waitForNavigation(),
    page.click(PRIMARY_BUTTON)
  ])

  // => https://github.com/join/plan

  await page.waitFor(PRIMARY_BUTTON)
  await Promise.all([
    page.waitForNavigation(),
    page.click(PRIMARY_BUTTON)
  ])

  // => https://github.com/join/customize

  await page.waitFor('a.alternate-action', { visible: true })
  await Promise.all([
    page.waitForNavigation(),
    page.click('a.alternate-action')
  ])

  // => https://github.com/dashboard

  // next step is to verify email from 'noreply@github.com'
  await page.close()
}
