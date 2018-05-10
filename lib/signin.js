'use strict'

const PRIMARY_BUTTON = 'input[type=submit].btn-primary'

module.exports = async (browser, user, opts) => {
  const page = await browser.newPage()
  await page.goto('https://github.com/login')

  await page.waitFor('input[name=login]', { visible: true })
  await page.type('input[name=login]', user.username || user.email)
  await page.type('input[type=password]', user.password)
  await Promise.all([
    page.waitForNavigation(),
    page.click(PRIMARY_BUTTON)
  ])

  // => https://github.com/
  await page.close()
}
