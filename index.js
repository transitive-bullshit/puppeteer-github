'use strict'

const puppeteer = require('puppeteer')

const signup = require('./lib/signup')
const signin = require('./lib/signin')
const signout = require('./lib/signout')

class PuppeteerGitHub {
  constructor (opts = { }) {
    this._opts = opts
    this._user = null
    this._isAuthenticated = false
  }

  get isAuthenticated () { return this._isAuthenticated }
  get user () { return this._user }

  async browser () {
    if (!this._browser) {
      this._browser = this._opts.browser || await puppeteer.launch(this._opts.puppeteer)
    }

    return this._browser
  }

  async signup (user, opts = { }) {
    if (this._isAuthenticated) throw new Error('"signup" requires no authentication')
    const browser = await this.browser()

    await signup(browser, user, opts)
    this._isAuthenticated = true
    this._user = user
  }

  async signin (user, opts = { }) {
    if (this._isAuthenticated) throw new Error('"signin" requires no authentication')
    const browser = await this.browser()

    await signin(browser, user, opts)
    this._isAuthenticated = true
    this._user = user
  }

  async signout () {
    if (!this._isAuthenticated) throw new Error('"signout" requires authentication')
    const browser = await this.browser()

    await signout(browser)
    this._isAuthenticated = false
    this._user = null
  }
}

module.exports = PuppeteerGitHub
