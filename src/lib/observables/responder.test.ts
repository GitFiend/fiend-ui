import {val} from './observable'
import {computed} from './computed'
import {reaction} from './responder'

describe('reaction tests', () => {
  test('basic reaction', () => {
    const n = val(4)

    const sqr = computed(() => n() * n())

    let out = 0
    reaction(
      () => sqr(),
      result => {
        out = result
      }
    )

    n(2)
    expect(out).toEqual(4)

    n(3)
    expect(out).toEqual(9)
  })
})
