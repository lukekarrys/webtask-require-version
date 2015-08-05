import path from 'path'
import fs from 'fs'
import semver from 'semver'
import resolve from 'resolve'

const baseRequire = module.constructor.prototype.require
const {NODE_ENV} = process.env

const satisfies = (v, s) => semver.satisfies(v, '^' + s) ? v : null

const resolveVersion = (name) => {
  const main = resolve.sync(name, {basedir: process.cwd()})
  const NM = '/node_modules/'
  const lastIndex = main.lastIndexOf(NM)
  const start = main.slice(0, lastIndex)
  const [moduleName] = main.slice(lastIndex).slice(NM.length).split(path.sep)
  const packagePath = path.join(start, 'node_modules', moduleName, 'package.json')
  return JSON.parse(fs.readFileSync(packagePath)).version
}

const newRequire = function (request) {
  let newRequest = request
  const [name, version] = request.split('@')

  if (name && version) {
    const match = satisfies(resolveVersion(name), version)

    if (match) {
      if (match !== version && NODE_ENV !== 'production') {
        console.warn(`${name} was required as ${version} but will be using ${match}.`)
      }
      newRequest = name
    } else {
      throw new Error(`Tried to require ${name} but could not find a version that satisfied semver for ${version}.`)
    }
  }

  return baseRequire.apply(this, [newRequest])
}

module.constructor.prototype.require = newRequire
