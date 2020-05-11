import {autorun} from './reactions'
import {obs} from './observable'
import {runInAction} from './action'
import {computed} from './computed'

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

  test('nested computed', () => {
    let count1 = 0
    let count2 = 0

    const a = obs(5)

    const c = computed(() => {
      count1++
      return a() * 3
    })

    const c2 = computed(() => {
      count2++
      return c() + 2
    })

    expect(c2()).toEqual(17)

    a(4)

    expect(c()).toEqual(12)
    expect(c2()).toEqual(14)
    expect(count2).toEqual(2)

    a(6)
    expect(c2()).toEqual(20)
    expect(count2).toEqual(3)
  })

  /*

  I think computeds need to keep their own queue and run when called upon?

  They are different from reactions.

   */
  test('computeds in actions', () => {
    const a = obs(2)
    const c = computed(() => a() + 1)

    runInAction(() => {
      // a isn't notifying c because it's inside a reaction.
      a(3)
      expect(c()).toEqual(4)
    })
  })
})
