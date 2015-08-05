import test from 'tape'

require('../src/index')

test('Can require a module by matching version', (t) => {
  t.doesNotThrow(() => require('semver@5.0.1'), 'can require semver@5.0.1')
  t.end()
})

test('Can require a module by semver version', (t) => {
  t.doesNotThrow(() => require('semver@5.0.0'), 'can require semver@5.0.0')
  t.end()
})

test('Cannot require a module by semver version that doesnt match', (t) => {
  t.throws(() => require('semver@6.0.0'), 'cannot require semver@6.0.0')
  t.end()
})

test('Can require a module without a version', (t) => {
  t.doesNotThrow(() => require('semver'), 'can require semver')
  t.end()
})
