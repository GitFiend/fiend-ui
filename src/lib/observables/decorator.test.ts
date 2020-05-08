import {autorun, IReactionDisposer, observable} from 'mobx'
import {obs} from './observables'
import {autorun as autoRun} from './computed'

function ob<T>(value: T): {(): T; (newValue: T): undefined} {
  const obs = observable.box(value)

  function inner(): T
  function inner(newValue: T): undefined
  function inner(newValue?: T) {
    if (arguments.length === 0) return obs.get()

    if (newValue !== undefined) obs.set(newValue)

    return undefined
  }

  return inner
}

describe('o', () => {
  test('o', () => {
    const n = ob(5)
    let ok = false

    autorun(() => {
      console.log('n: ', n())

      if (n() === 6) {
        ok = true
      }
    })

    n(6)

    expect(ok).toBeTruthy()
  })
})

describe('test decorator perf', () => {
  const loops = 10

  test('time a', () => {
    class A {
      @observable
      a = 5

      @observable
      b = 5

      @observable
      c = 5

      @observable
      d = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }

    class RunA {
      a = new A()

      disposer: IReactionDisposer

      constructor() {
        this.disposer = autorun(() => {
          const {a, b, c, d} = this.a

          d.push(a, b, c)
        })
      }
    }

    console.time('a')
    for (let i = 0; i < loops; i++) {
      const a = new RunA()
      a.disposer()
    }
    console.timeEnd('a')
  })

  test('time b', () => {
    class B {
      a = observable.box(5)

      b = observable.box(5)

      c = observable.box(5)

      d = observable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }

    class RunB {
      b = new B()

      disposer: IReactionDisposer

      constructor() {
        this.disposer = autorun(() => {
          const {a, b, c, d} = this.b

          d.push(a.get(), b.get(), c.get())
        })
      }
    }

    console.time('b')
    for (let i = 0; i < loops; i++) {
      const b = new RunB()
      b.disposer()
    }
    console.timeEnd('b')
  })

  test('C', () => {
    function mkC() {
      return observable({
        a: 5,
        b: 5,
        c: 5,
        d: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      })
    }

    class RunC {
      c = mkC()

      disposer: IReactionDisposer

      constructor() {
        this.disposer = autorun(() => {
          const {a, b, c, d} = this.c

          d.push(a, b, c)
        })
      }
    }

    console.time('c')
    for (let i = 0; i < loops; i++) {
      const c = new RunC()
      c.disposer()
    }
    console.timeEnd('c')
  })

  test('d', () => {
    class D {
      a = ob(5)

      b = ob(5)

      c = ob(5)

      d = observable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }

    class RunD {
      b = new D()

      disposer: IReactionDisposer

      constructor() {
        this.disposer = autorun(() => {
          const {a, b, c, d} = this.b

          d.push(a(), b(), c())
        })
      }
    }

    console.time('d')
    for (let i = 0; i < loops; i++) {
      const d = new RunD()
      d.disposer()
    }
    console.timeEnd('d')
  })

  xtest('e', () => {
    class E {
      a = obs(5)

      b = obs(5)

      c = obs(5)

      d = obs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }

    class Run {
      b = new E()

      // disposer: IReactionDisposer

      constructor() {
        autoRun(() => {
          const {a, b, c, d} = this.b

          const array = d()
          array.push(a(), b(), c())

          d(array.slice(0))
        })
      }
    }

    console.time('e')
    for (let i = 0; i < loops; i++) {
      const d = new Run()
      // d.disposer()
    }
    console.timeEnd('e')
  })
})

/*
    RangeError: Maximum call stack size exceeded

      10 |   function inner(): T
      11 |   function inner(newValue: T): undefined
    > 12 |   function inner(newValue?: T) {
         |                 ^
      13 |     if (arguments.length === 0) return a.get()
      14 |
      15 |     if (newValue !== undefined) a.set(newValue)

      at inner (src/lib/observables/observables.ts:12:17)
      at Reaction.f (src/lib/observables/decorator.test.ts:198:25)
      at Reaction.run (src/lib/observables/computed.ts:63:10)
      at Atom.set (src/lib/observables/observables.ts:47:11)
      at inner (src/lib/observables/observables.ts:15:35)
      at Reaction.f (src/lib/observables/decorator.test.ts:201:11)
      at Reaction.run (src/lib/observables/computed.ts:63:10)
      at Atom.set (src/lib/observables/observables.ts:47:11)
      at inner (src/lib/observables/observables.ts:15:35)
      at Reaction.f (src/lib/observables/decorator.test.ts:201:11)
      at Reaction.run (src/lib/observables/computed.ts:63:10)
      at Atom.set (src/lib/observables/observables.ts:47:11)
      at inner (src/lib/observables/observables.ts:15:35)
      at Reaction.f (src/lib/observables/decorator.test.ts:201:11)
      at Reaction.run (src/lib/observables/computed.ts:63:10)
      at Atom.set (src/lib/observables/observables.ts:47:11)
      at inner (src/lib/observables/observables.ts:15:35)
 */
