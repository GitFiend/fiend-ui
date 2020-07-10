import {autorun, computed, IReactionDisposer, observable} from 'mobx'
import {val} from './observable'
import {autoRun} from './responder'
import {globalStack} from './global-stack'

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

function computed2<T>(f: () => T) {
  const c = computed(f)

  return () => {
    return c.get()
  }
}

xdescribe('o', () => {
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

describe('mobx behaviour', () => {
  test('autorun supports setting', () => {
    const a = observable.box(2)
    const b = observable.box(2)
    const c = computed(() => a.get() * b.get())
    let d: number = c.get()

    expect(c.get()).toEqual(4)
    let count = 0

    autorun(() => {
      count++
      b.set(a.get() * 5)

      expect(b.get()).toEqual(10)
      expect(c.get()).toEqual(20)

      d = c.get()
    })

    expect(count).toEqual(1)
  })
})

xdescribe('test decorator perf', () => {
  const loops = 1000

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

      res = computed2(() => this.a() + this.b() + this.c())

      d = observable.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
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

      console.log(d.b.res())
      d.disposer()
    }
    console.timeEnd('d')
  })

  test('e', () => {
    class E {
      a = val(5)

      b = val(5)

      c = val(5)

      d = val([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }

    class Run {
      b = new E()

      constructor() {
        autoRun(() => {
          const {a, b, c, d} = this.b

          const array = [...d()]

          array.push(a(), b(), c())

          d(array)
        })
      }
    }

    console.time('e')
    for (let i = 0; i < loops; i++) {
      new Run()
    }

    console.timeEnd('e')
  })
})
