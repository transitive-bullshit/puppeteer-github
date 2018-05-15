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
 *
 * @example
 * // This example signs into a GitHub account and stars the react repo.
 * const PuppeteerGitHub = require('puppeteer-github')
 *
 * const github = new PuppeteerGitHub()
 *
 * await github.signin({ username: 'xxx', password: 'xxx' })
 * await github.starRepo('facebook/react')
 *
 * await github.close()
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
   * Puppeteer Browser instance to use.
   *
   * @return {Promise<Object>}
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

  /**
   * Signs into an existing GitHub account.
   *
   * Note: either username or email is required.
   *
   * @param {Object} user - User details for new account
   * @param {string} [user.username] - Username
   * @param {string} [user.email] - Email
   * @param {string} user.password - Password
   * @param {Object} [opts={ }] - Options
   * @return {Promise}
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
   * @return {Promise}
   */
  async signout () {
    if (!this._isAuthenticated) throw new Error('"signout" requires authentication')
    const browser = await this.browser()

    await signout(browser)
    this._isAuthenticated = false
    this._user = null
  }

  /**
   * Verifies the authenticated GitHub account's email via pupeteer-email.
   *
   * @param {Object} opts - Options
   * @param {string} opts.emailPassword - Email password for verification
   * @param {string} [opts.email] - Email verification (defaults to user's GitHub email)
   * @return {Promise}
   */
  async verifyEmail (opts) {
    if (!opts.emailPassword || !opts.emailPassword.length) {
      throw new Error('missing required "email-password" for email verification')
    }

    const browser = await this.browser()
    await verifyEmail(browser, {
      email: opts.email || this.user.email,
      password: opts.emailPassword
    }, opts)
  }

  /**
   * Stars an npm package's github repository.
   *
   * @param {string} pkgName - NPM package name.
   * @return {Promise}
   *
   * @example
   * const gh = new PuppeteerGitHub()
   * await gh.signin(...)
   * await gh.starPackage('react')
   * await gh.close()
   */
  async starPackage (pkgName) {
    const url = await getRepositoryUrl(pkgName)
    return this.starRepo(url)
  }

  /**
   * Unstars an npm package's github repository.
   *
   * @param {string} pkgName - NPM package name.
   * @return {Promise}
   */
  async unstarPackage (pkgName) {
    const url = await getRepositoryUrl(pkgName)
    return this.unstarRepo(url)
  }

  /**
   * Stars a github repository.
   *
   * @param {string} pkgName - NPM package name.
   * @return {Promise}
   *
   * @example
   * const gh = new PuppeteerGitHub()
   * await gh.signin(...)
   * await gh.starRepo('avajs/ava')
   * await gh.starRepo('https://github.com/facebook/react')
   * await gh.close()
   */
  async starRepo (repo) {
    const browser = await this.browser()
    return starRepo(browser, repo)
  }

  /**
   * Unstars a github repository.
   *
   * @param {string} pkgName - NPM package name.
   * @return {Promise}
   */
  async unstarRepo (repo) {
    const browser = await this.browser()
    return unstarRepo(browser, repo)
  }

  /**
   * Closes the underlying browser instance, effectively ending this session.
   *
   * @return {Promise}
   */
  async close () {
    const browser = await this.browser()
    return browser.close()
  }
}

module.exports = PuppeteerGitHub
