import {$Model, makeObservable} from './$model'
import {$AutoRun} from './responder'
import {$Val} from './value-style'

describe('memory leak test', () => {
  let n = 0
  const outer = $Val(0)

  class A {
    constructor() {
      makeObservable(this)

      $AutoRun(() => {
        this.$b
      })
    }
    get $b() {
      n++
      return outer()
    }
  }

  test('a', () => {
    new A()
    expect(n).toEqual(1)
    outer(outer() + 1)
    expect(n).toEqual(2)
  })

  test('a2', () => {
    new A()
    expect(n).toEqual(3)
    outer(outer() + 1)
    expect(n).toEqual(5)
  })
})

describe('memory leak test2', () => {
  let n = 0
  const outer = $Val(0)

  class A extends $Model {
    constructor() {
      super()
      super.connect()

      this.$AutoRun(() => {
        this.$b
      })
    }
    get $b() {
      n++
      return outer()
    }
  }

  test('a', () => {
    const a = new A()
    expect(n).toEqual(1)
    outer(outer() + 1)
    expect(n).toEqual(2)

    a.disposeReactions()
  })

  test('a2', () => {
    new A()
    expect(n).toEqual(3)
    outer(outer() + 1)
    expect(n).toEqual(4)
  })
})
