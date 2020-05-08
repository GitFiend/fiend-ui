import {autorun, computed} from './computed'
import {obs, t} from './observables'

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

  test('computed', () => {
    const a = obs(5)
    const c = computed(() => a() * 3)

    expect(c()).toEqual(15)

    a(6)
    expect(c()).toEqual(18)
  })
})
