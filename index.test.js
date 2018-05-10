'use strict'

const { test } = require('ava')

const PuppeteerGitHub = require('.')

test('basic', (t) => {
  const github = new PuppeteerGitHub()
  t.is(github.isAuthenticated, false)
  t.is(github.user, null)
})
