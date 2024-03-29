import {$AutoRun} from './responder'
import {$RunInAction} from './action'
import {makeObservable} from './$model'
import {$Calc, $Val} from './value-style'

describe('observables', () => {
  test('autorun', () => {
    let count = 0
    const a = $Val(5)

    $AutoRun(() => {
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
    const a = $Val(5)

    const c = $Calc(() => {
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

    const a = $Val(5)

    const c = $Calc(() => {
      count1++
      return a() * 3
    })

    const c2 = $Calc(() => {
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
    let count = 0

    const a = $Val(2)
    const c = $Calc(() => {
      count++
      return a() + 1
    })

    expect(count).toEqual(0)
    c()
    expect(count).toEqual(1)

    $RunInAction(() => {
      a(3)
      expect(a()).toEqual(3)
      expect(c()).toEqual(4)
    })

    expect(count).toEqual(2)
  })

  test('computeds in actions 2', () => {
    class A {
      count = 0

      $a = 2

      get $c() {
        this.count++
        return this.$a + 1
      }

      constructor() {
        makeObservable(this)
      }
    }

    const a = new A()

    expect(a.count).toEqual(0)

    a.$c

    $RunInAction(() => {
      a.$a = 3

      expect(a.$a).toEqual(3)
      expect(a.count).toEqual(1)

      expect(a.$c).toEqual(4)
      expect(a.count).toEqual(2)
    })
  })
})
