'use strict'

const puppeteer = require('puppeteer')

const signup = require('./lib/signup')
const signin = require('./lib/signin')
const signout = require('./lib/signout')

/**
 * @param {Object} [opts={ }] - Options
 * @param {Object} [opts.browser] - Puppeteer browser instance to use
 * @param {Object} [opts.puppeteer] - Puppeteer [launch options](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)
 */
class PuppeteerGitHub {
  constructor (opts = { }) {
    this._opts = opts
    this._user = null
    this._isAuthenticated = false
  }

  /**
   * Whether or not this instance is authenticated with GitHub.
   *
   * @member {boolean}
   */
  get isAuthenticated () { return this._isAuthenticated }

  /**
   * Authenticated user if authenticated with GitHub.
   *
   * @member {Object}
   */
  get user () { return this._user }

  /**
   * Puppeteer Browser instance in use.
   *
   * @returns {Promise<Object>} - Puppeteer Browser instance
   */
  async browser () {
    if (!this._browser) {
      this._browser = this._opts.browser || await puppeteer.launch(this._opts.puppeteer)
    }

    return this._browser
  }

  /**
   * Automates the creation of a new GitHub account.
   *
   * @param {Object} user - User details for new account
   * @param {string} user.username - Username
   * @param {string} user.email - Email
   * @param {string} user.password - Password
   * @param {Object} [opts={ }] - Options
   * @returns {Promise}
   */
  async signup (user, opts = { }) {
    if (this._isAuthenticated) throw new Error('"signup" requires no authentication')
    const browser = await this.browser()

    await signup(browser, user, opts)
    this._isAuthenticated = true
    this._user = user
  }

  /**
   * Signs into an existing GitHub account.
   *
   * Note: username or email are required.
   *
   * @param {Object} user - User details for new account
   * @param {string} [user.username] - Username
   * @param {string} [user.email] - Email
   * @param {string} user.password - Password
   * @param {Object} [opts={ }] - Options
   * @returns {Promise}
   */
  async signin (user, opts = { }) {
    if (this._isAuthenticated) throw new Error('"signin" requires no authentication')
    const browser = await this.browser()

    await signin(browser, user, opts)
    this._isAuthenticated = true
    this._user = user
  }

  /**
   * Signs out of the currently authenticated GitHub account.
   *
   * @returns {Promise}
   */
  async signout () {
    if (!this._isAuthenticated) throw new Error('"signout" requires authentication')
    const browser = await this.browser()

    await signout(browser)
    this._isAuthenticated = false
    this._user = null
  }

  async starNpmPackage (pkg) {
  }

  async starRepo (repo) {
  }

  /**
   * Closes the underlying Puppeteer browser, effectively ending this session.
   *
   * @returns {Promise}
   */
  async close () {
    const browser = await this.browser()
    return browser.close()
  }
}

module.exports = PuppeteerGitHub
