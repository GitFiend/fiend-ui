import {$AutoRun, F0} from '../responder'
import {makeObservable} from '../$model'

describe('computed run behaviour', () => {
  class A {
    d: F0[] = []
    runs = 0

    $o = 0

    constructor() {
      makeObservable(this)
    }

    get $c() {
      this.runs++
      return this.$o
    }

    result = 0

    enableReactions() {
      this.d.push(
        $AutoRun(() => {
          this.result = this.$c
        })
      )
    }

    disableReactions() {
      this.d.forEach(d => d())
      this.d = []
    }
  }

  test('Runs at expected times when responder is off or on', () => {
    const a = new A()
    expect(a.runs).toBe(0)
    a.enableReactions()
    expect(a.runs).toBe(1)
    a.$o = 1

    expect(a.runs).toBe(2)
    expect(a.result).toBe(1)

    a.disableReactions()
    expect(a.runs).toBe(2)

    a.$o = 2
    expect(a.runs).toBe(2)
    expect(a.result).toBe(1)

    a.$o = 3
    expect(a.runs).toBe(2)
    expect(a.result).toBe(1)

    a.$o = 4
    a.enableReactions()
    expect(a.runs).toBe(3)
    expect(a.result).toBe(4)
  })
})
