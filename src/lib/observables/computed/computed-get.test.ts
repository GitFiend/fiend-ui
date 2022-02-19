import {makeObservable} from '../$model'
import {Computed} from './computed'
import {Atom} from '../atom'

describe('Computed get behaviour', () => {
  test('1 computed, call get without a responder', () => {
    class A {
      declare __$o: Atom<number>
      $o = 0

      runs = 0

      constructor() {
        makeObservable(this)
      }

      declare __$c: Computed<number>
      get $c() {
        this.runs++
        return this.$o
      }
    }

    const a = new A()
    expect(a.runs).toBe(0)

    // call get(null)
    a.$c
    expect(a.runs).toBe(1)

    a.$o = 1
    expect(a.runs).toBe(1)

    expect(a.__$c._ref.current).toBe(null)
    expect(a.__$o.hasActiveResponders()).toBe(false)
  })

  xtest(`Computed shouldn't become active if the calling computed isn't active`, () => {
    class A {
      declare __$o: Atom<number>
      $o = 0

      constructor() {
        makeObservable(this)
      }

      declare __$c: Computed<number>
      get $c() {
        return this.$o
      }

      declare __$c2: Computed<number>
      get $c2() {
        return this.$c
      }
    }

    const a = new A()

    expect(a.$c2).toBe(0)
    expect(a.__$c2._ref.current).toBe(null)
    expect(a.__$c._ref.current).toBe(null)
  })
})
