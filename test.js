import assert from 'node:assert/strict'
import test from 'node:test'
import {iso31661} from './1.js'
import {iso31661Reserved} from './1-reserved.js'
import {iso31662} from './2.js'
import {iso31663} from './3.js'
import {iso31661Alpha2ToAlpha3} from './1-a2-to-1-a3.js'
import {iso31661Alpha2ToNumeric} from './1-a2-to-1-n.js'
import {iso31661Alpha3ToAlpha2} from './1-a3-to-1-a2.js'
import {iso31661NumericToAlpha2} from './1-n-to-1-a2.js'

test('iso-3166/1', function () {
  /** @type {Array<string>} */
  const iA2s = []
  /** @type {Array<string>} */
  const iA3s = []
  /** @type {Array<string>} */
  const iNs = []

  let index = -1

  while (++index < iso31661.length) {
    const d = iso31661[index]
    assert.ok(d.state === 'assigned', 'should be assigned')
    assert.ok(a2(d.alpha2), 'should have an alpha-2')
    assert.ok(!iA2s.includes(d.alpha2), 'should have a unique alpha-2')
    assert.ok(a3(d.alpha3), 'should have an alpha-3')
    assert.ok(!iA3s.includes(d.alpha3), 'should have a unique alpha-3')
    assert.ok(numeric(d.numeric), 'should have a numeric')
    assert.ok(!iNs.includes(d.numeric), 'should have a unique numeric')
    assert.ok(name(d.name), 'should have a name')

    iA2s.push(d.alpha2)
    iA3s.push(d.alpha3)
    iNs.push(d.numeric)
  }
})

test('iso-3166/1-reserved', function () {
  /** @type {Array<string>} */
  const iA2s = []

  let index = -1

  while (++index < iso31661Reserved.length) {
    const d = iso31661Reserved[index]
    assert.ok(
      d.state === 'indeterminately-reserved' ||
        d.state === 'exceptionally-reserved' ||
        d.state === 'transitionally-reserved' ||
        d.state === 'formerly-assigned',
      'should be reserved'
    )
    assert.ok(a2(d.alpha2), 'should have an alpha-2')
    assert.ok(!iA2s.includes(d.alpha2), 'should have a unique code')
    assert.ok(name(d.name), 'should have a name')

    iA2s.push(d.alpha2)
  }
})

test('iso-3166/2', function () {
  /** @type {Array<string>} */
  const i1s = []
  /** @type {Array<string>} */
  const i2sInitial = []
  /** @type {Array<string>} */
  const i2s = []

  let index = -1

  while (++index < iso31661.length) {
    const d = iso31661[index]
    i1s.push(d.alpha2)
  }

  index = -1

  while (++index < iso31662.length) {
    const d = iso31662[index]
    i2sInitial.push(d.code)
  }

  index = -1

  while (++index < iso31662.length) {
    const d = iso31662[index]
    assert.ok(i2(d.code), 'should have a code')
    assert.ok(!i2s.includes(d.code), 'should have a unique code')
    assert.ok(name(d.name), 'should have a name')
    assert.ok(i2(d.parent) || a2(d.parent), 'should have a parent')
    assert.ok(
      i2sInitial.includes(d.parent) || i1s.includes(d.parent),
      'should have a known, assigned, parent'
    )

    i2s.push(d.code)
  }
})

test('iso-3166/3', function () {
  /** @type {Array<string>} */
  const a4s = []

  let index = -1

  while (++index < iso31663.length) {
    const d = iso31663[index]
    assert.ok(
      d.type === 'merge' || d.type === 'change' || d.type === 'split',
      'should have a type'
    )
    assert.ok(a4(d.alpha4), 'should have an alpha-4')
    assert.ok(!a4s.includes(d.alpha4), 'should have a unique alpha-4')

    assert.ok(d.from.state === 'formerly-assigned', 'from should be removed')
    assert.ok(a2(d.from.alpha2), 'from should have an alpha-2')
    assert.ok(a3(d.from.alpha3), 'from should have an alpha-2')
    assert.ok(name(d.from.name), 'from should have a name')

    if (d.from.numeric) {
      assert.ok(
        numeric(d.from.numeric),
        'if there is a numeric, from should have a valid numeric'
      )
    }

    let offset = -1

    while (++offset < d.to.length) {
      const to = d.to[offset]
      const label = 'to `' + to.alpha2 + '`'

      assert.ok(
        to.state === 'assigned' || to.state === 'formerly-assigned',
        label + ' should be removed or assigned'
      )
      assert.ok(a2(to.alpha2), label + ' should have an alpha-2')
      assert.ok(a3(to.alpha3), label + ' should have an alpha-2')
      assert.ok(name(to.name), label + ' should have a name')

      assert.ok(numeric(to.numeric), label + ' should have a valid numeric')
    }

    a4s.push(d.alpha4)
  }
})

test('iso-3166/1-a2-to-1-a3', function () {
  const keys = Object.keys(iso31661Alpha2ToAlpha3)

  let index = -1

  while (++index < keys.length) {
    const d = keys[index]
    assert.ok(a2(d), 'key should be an alpha-2')
    assert.ok(a3(iso31661Alpha2ToAlpha3[d]), 'value should be an alpha-3')
  }
})

test('iso-3166/1-a3-to-1-a2', function () {
  const keys = Object.keys(iso31661Alpha3ToAlpha2)

  let index = -1

  while (++index < keys.length) {
    const d = keys[index]
    assert.ok(a3(d), 'key should be an alpha-3')
    assert.ok(a2(iso31661Alpha3ToAlpha2[d]), 'value should be an alpha-2')
  }
})

test('iso-3166/1-a2-to-1-n', function () {
  const keys = Object.keys(iso31661Alpha2ToNumeric)

  let index = -1

  while (++index < keys.length) {
    const d = keys[index]
    assert.ok(a2(d), 'key should be an alpha-2')
    assert.ok(numeric(iso31661Alpha2ToNumeric[d]), 'value should be a numeric')
  }
})

test('iso-3166/1-n-to-1-a2', function () {
  const keys = Object.keys(iso31661NumericToAlpha2)

  let index = -1

  while (++index < keys.length) {
    const d = keys[index]
    assert.ok(numeric(d), 'key should be a numeric')
    assert.ok(a2(iso31661NumericToAlpha2[d]), 'value should be an alpha-2')
  }
})

/**
 * @param {string} value
 * @returns {boolean}
 */
function a2(value) {
  return /^[A-Z]{2}$/.test(value)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function a3(value) {
  return /^[A-Z]{3}$/.test(value)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function a4(value) {
  return /^[A-Z]{4}$/.test(value)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function numeric(value) {
  return /^\d{3}$/.test(value)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function i2(value) {
  return /^[A-Z]{2}-[A-Z\d]{1,3}$/.test(value)
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function name(value) {
  return typeof value === 'string' && value.length > 1
}
