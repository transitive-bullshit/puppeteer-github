# puppeteer-github

> [GitHub](https://github.com) automation driven by headless chrome.

[![NPM](https://img.shields.io/npm/v/puppeteer-github.svg)](https://www.npmjs.com/package/puppeteer-github) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-github.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-github) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save puppeteer-github
```


## Usage

This example signs into a [GitHub](https://github.com) account.

```js
const PuppeteerGitHub = require('puppeteer-github')

const github = new PuppeteerGitHub()

const username = 'XXX'
const password = 'XXX'

await github.signin({ username, password })
await github.close()
```


## API

**TODO**


## Related

- [puppeteer-github-cli](https://github.com/transitive-bullshit/puppeteer-github-cli) - CLI for this module.
- [puppeteer-email](https://github.com/transitive-bullshit/puppeteer-email) - Email automation driven by headless chrome.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
