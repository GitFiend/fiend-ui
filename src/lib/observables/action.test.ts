import {runInAction} from './action'
import {autorun} from './reactions'
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
      // console.log(b())
    })

    expect(count).toEqual(1)
    // console.log(count)
  })
})
