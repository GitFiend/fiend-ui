import {autorun, computed} from './computed'
import {obs} from './observables'

describe('observables', () => {
  test('autorun', () => {
    let count = 0
    const a = obs(5)

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

  test('computed', () => {
    let count = 0
    const a = obs(5)

    const c = computed(() => {
      count++
      return a() * 3
    })

    a(5)
    a(5)

    expect(c()).toEqual(15)
    expect(count).toEqual(1)

    a(6)
    expect(c()).toEqual(18)
    expect(count).toEqual(2)
  })
})
