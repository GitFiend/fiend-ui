import {autorun} from './computed'
import {obs} from './observables'

describe('observables', () => {
  test('autorun', () => {
    const a = obs(5)
    let count = 0

    autorun(() => {
      count++
      a()
    })

    a(6)
    expect(a()).toEqual(6)
    expect(count).toEqual(2)

    a(7)
    expect(a()).toEqual(7)
    expect(count).toEqual(3)
  })
})
