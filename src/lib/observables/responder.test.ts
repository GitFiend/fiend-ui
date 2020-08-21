import {$Val} from './observable'
import {$Calc} from './computed'
import {$Reaction} from './responder'

describe('reaction tests', () => {
  test('basic reaction', () => {
    const n = $Val(4)

    const sqr = $Calc(() => n() * n())

    let out = 0
    $Reaction(
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
