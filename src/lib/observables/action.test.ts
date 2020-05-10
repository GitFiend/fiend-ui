import {action} from './action'
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

    action(() => {
      a(2)
      a(3)
      a(4)
    })

    expect(count).toEqual(2)
  })
})
