import {makeObservable} from './$model'
import {$AutoRun, F0} from './responder'

describe('Computed', () => {
  class A {
    d: F0[] = []
    runs = 0

    $o = 1

    get $c1() {
      return this.$o
    }
    get $c2() {
      return this.$c1 * 2
    }
    get $c3() {
      return this.$c2 * 2
    }

    constructor() {
      makeObservable(this)
    }

    enableReactions() {
      this.d.push(
        $AutoRun(() => {
          this.runs++
          const {$c3} = this
          console.log({$c3})
        })
      )
    }

    disableReactions() {
      this.d.forEach(d => d())
      this.d = []
    }
  }

  test('Chained computeds called outside reactive context', () => {
    const a = new A()
    a.enableReactions()

    expect(a.runs).toBe(1)

    a.disableReactions()

    a.$o = 2

    // Call computeds outside reactive context.
    a.$c1
    a.$c2
    a.$c3

    a.$o = 3

    expect(a.runs).toBe(1)
    a.enableReactions()
    expect(a.runs).toBe(2)

    expect(a.$c3).toBe(12)
  })
})
