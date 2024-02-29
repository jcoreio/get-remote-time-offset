// @flow

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { getRemoteTimeOffset } from '../src'

describe('getRemoteTimeOffset', () => {
  it('works', async (): Promise<void> => {
    expect(
      Math.abs(
        340 +
          (await getRemoteTimeOffset(() => Promise.resolve(Date.now() - 340)))
      )
    ).to.be.below(3)
  })
  it(`rejects invalid numQueries`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(Date.now()), { numQueries: -1 })
    ).to.be.rejectedWith('invalid numQueries: -1')
  })
  it(`rejects invalid timeBetweenQueries`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(Date.now()), {
        timeBetweenQueries: -1,
      })
    ).to.be.rejectedWith('invalid timeBetweenQueries: -1')
  })
  it(`rejects invalid timeout`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(Date.now()), { timeout: -1 })
    ).to.be.rejectedWith('invalid timeout: -1')
  })
  it(`rejects timeout too low`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(Date.now()), {
        numQueries: 3,
        timeBetweenQueries: 2,
        timeout: 3,
      })
    ).to.be.rejectedWith('timeout is too low to possibly finish: 3')
  })
  it(`rejects infinite time`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(Infinity))
    ).to.be.rejectedWith('time cannot be infinite')
  })
  it(`rejects null time`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(null as any))
    ).to.be.rejectedWith('time cannot be null or undefined')
  })
  it(`rejects undefined time`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(undefined as any))
    ).to.be.rejectedWith('time cannot be null or undefined')
  })
  it(`rejects NaN time`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(NaN))
    ).to.be.rejectedWith('time cannot be NaN')
  })
  it(`rejects time < 0`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.resolve(-3))
    ).to.be.rejectedWith('time is out of range: -3')
  })
  it(`timeout works`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(Date.now()), 1000)),
        { timeout: 100 }
      )
    ).to.be.rejectedWith('timed out')
  })
  it(`tolerates less than maxRejections`, async function (): Promise<void> {
    let count = 0
    expect(
      Math.abs(
        340 +
          (await getRemoteTimeOffset(
            () =>
              count++ < 2
                ? Promise.reject(new Error('test'))
                : Promise.resolve(Date.now() - 340),
            { maxRejections: 3 }
          ))
      )
    ).to.be.below(3)
  })
  it(`doesn't tolerate more than maxRejections`, async function (): Promise<void> {
    await expect(
      getRemoteTimeOffset(() => Promise.reject(new Error('test')), {
        maxRejections: 3,
      })
    ).to.be.rejectedWith('test')
  })
})
