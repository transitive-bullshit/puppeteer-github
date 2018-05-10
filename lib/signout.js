'use strict'

module.exports = async (browser, user, opts) => {
  const page = await browser.newPage()
  await page.goto('https://github.com/')

  await page.waitFor('.HeaderNavlink.name')
  page.click('.HeaderNavlink.name')

  await page.waitFor('.logout-form button[type=submit]', { visible: true })
  await Promise.all([
    page.waitForNavigation(),
    page.click('.logout-form button[type=submit]')
  ])

  // => https://github.com/

  await page.close()
}
