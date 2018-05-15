'use strict'

const getRepositoryUrl = require('get-repository-url')
const puppeteer = require('puppeteer')

const signup = require('./lib/signup')
const signin = require('./lib/signin')
const signout = require('./lib/signout')
const starRepo = require('./lib/star-repo')
const unstarRepo = require('./lib/unstar-repo')
const verifyEmail = require('./lib/verify-email')

/**
 * [GitHub](https://github.com) automation driven by headless chrome.
 *
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
   * Automates the creation of a new GitHub account.
   *
   * @param {object} user - User details for new account
   * @param {string} user.username - Username
   * @param {string} user.email - Email
   * @param {string} user.password - Password
   * @param {object} [opts={ }] - Options
   * @param {boolean} [opts.verifyEmail] - Whether or not to verify email
   * @param {string} [opts.emailPassword] - Email password for verification
   * @return {Promise}
   */
  async signup (user, opts = { }) {
    if (this._isAuthenticated) throw new Error('"signup" requires no authentication')
    const browser = await this.browser()

    await signup(browser, user, opts)
    this._isAuthenticated = true
    this._user = user

    if (opts.verifyEmail) {
      await this.verifyEmail(opts)
    }
  }
}

module.exports = PuppeteerGitHub
