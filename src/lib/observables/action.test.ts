import {runInAction} from './action'
import {autorun, computed} from './reactions'
import {obs} from './observable'

describe('action', () => {
  test('action batches updates', () => {
    const a = obs(1)
    let count = 0

    autorun(() => {
      count++
      a()
    })

    runInAction(() => {
      a(2)
      a(3)
      a(4)
    })

    expect(count).toEqual(2)
  })

  test('autorun supports setting', () => {
    const a = obs(1)
    const b = obs(2)
    let count = 0

    autorun(() => {
      count++
      b(a() * 5)
    })

    expect(count).toEqual(1)
  })

  xtest('autoRun with computed inside behaves', () => {
    const a = obs(2)
    const b = obs(2)
    const c = computed(() => a() * b())
    let d: number = c()

    expect(c()).toEqual(4)

    let count = 0

    autorun(() => {
      count++
      b(a() * 5)

      expect(b()).toEqual(10)

      // Computed needs to update now.
      expect(c()).toEqual(20)

      d = c()
    })

    expect(count).toEqual(1)
  })
})
