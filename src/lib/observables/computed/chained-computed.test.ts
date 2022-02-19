import {makeObservable} from '../$model'
import {$AutoRun, F0} from '../responder'
import {Computed} from './computed'

describe('Computed', () => {
  class A {
    d: F0[] = []
    runs = 0

    $o = 1

    declare __$c1: Computed<number>
    get $c1(): number {
      return this.$o + 1
    }

    declare __$c2: Computed<number>
    get $c2(): number {
      return this.$c1 + 1
    }

    declare __$c3: Computed<number>
    get $c3(): number {
      return this.$c2 + 1
    }

    constructor() {
      makeObservable(this)
    }

    result = 0
    enableReactions() {
      this.d.push(
        $AutoRun(() => {
          this.runs++
          this.result = this.$c3
        })
      )
    }

    disableReactions() {
      this.d.forEach(d => d())
      this.d = []
    }
  }

  test('Chain of computeds activates when called', () => {
    const a = new A()
    a.enableReactions()

    expect(a.__$c3.isMarkedActive()).toBe(true)

    expect(a.$c1).toBe(2)
    expect(a.$c2).toBe(3)
    expect(a.$c3).toBe(4)

    expect(a.runs).toBe(1)

    a.disableReactions()
    expect(a.__$c3.isMarkedActive()).toBe(true)

    a.$o = 2

    expect(a.__$c3.isMarkedActive()).toBe(false)
    expect(a.__$c2.isMarkedActive()).toBe(false)
    expect(a.__$c1.isMarkedActive()).toBe(false)

    // Call computeds outside reactive context.
    expect(a.$c3).toBe(5)
    expect(a.__$c3._ref.current).toBe(null)

    a.$o = 3

    expect(a.runs).toBe(1)
    a.enableReactions()
    expect(a.runs).toBe(2)

    expect(a.$c3).toBe(6)
  })

  test('Chained computeds called outside reactive context', () => {
    const a = new A()
    a.enableReactions()

    expect(a.runs).toBe(1)

    a.disableReactions()

    a.$o = 2

    // Call computeds outside reactive context.
    a.$c1
    expect(a.__$c1.isMarkedActive()).toBe(false)
    a.$c2
    expect(a.__$c2.isMarkedActive()).toBe(false)
    a.$c3
    expect(a.__$c3.isMarkedActive()).toBe(false)

    a.$o = 3
    expect(a.__$c1.isMarkedActive()).toBe(false)
    expect(a.__$c2.isMarkedActive()).toBe(false)
    expect(a.__$c3.isMarkedActive()).toBe(false)

    expect(a.runs).toBe(1)
    a.enableReactions()

    expect(a.__$c1.isMarkedActive()).toBe(true)
    expect(a.__$c2.isMarkedActive()).toBe(true)
    expect(a.__$c3.isMarkedActive()).toBe(true)

    expect(a.runs).toBe(2)

    expect(a.$c3).toBe(6)
  })
})
