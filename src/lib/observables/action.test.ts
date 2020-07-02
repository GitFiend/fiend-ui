import {runInAction} from './action'
import {autoRun} from './subscriber'
import {val} from './observable'
import {computed} from './computed'

describe('action', () => {
  test('action batches updates', () => {
    const a = val(1)
    let count = 0

    autoRun(() => {
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
    const a = val(1)
    const b = val(2)
    let count = 0

    autoRun(() => {
      count++
      b(a() * 5)
    })

    expect(count).toEqual(1)
  })

  test('autoRun with computed inside behaves', () => {
    const a = val(2)
    const b = val(2)
    const c = computed(() => a() * b())
    let d: number = c()

    expect(c()).toEqual(4)

    let count = 0

    autoRun(() => {
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
