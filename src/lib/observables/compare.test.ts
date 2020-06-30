import {autorun, computed, IReactionDisposer, observable, runInAction} from 'mobx'
import {autoRun} from './auto-run'
import {val} from './observable'
import {computed as zComputed} from './computed'

describe('compare mbox computeds with zeact', () => {
  const loops = 1000

  test('time b', () => {
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

      @computed
      get c(): number {
        return this.a.a + this.a.b + this.a.c
      }
    }

    console.time('mobx')
    let z = 0

    for (let i = 0; i < loops; i++) {
      const a = new RunA()

      runInAction(() => {
        a.a.a = 10
      })
      runInAction(() => {
        a.a.a = 12
      })
      runInAction(() => {
        a.a.a = 14
      })

      z = a.c

      // console.log('mobx', z)

      a.disposer()
    }
    expect(z).toEqual(24)

    console.timeEnd('mobx')
  })

  test('zeact', () => {
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

          const array = d()
          array.push(a(), b(), c())

          d(array.slice(0))
          // console.log(d())
        })
      }
    }

    console.time('zeact')
    let z = 0
    for (let i = 0; i < loops; i++) {
      const r = new Run()

      const c = zComputed(() => {
        return r.b.a() + r.b.b() + r.b.c()
      })

      r.b.a(10)
      r.b.a(12)
      r.b.a(14)
      z = c()
      // console.log('zeact', z)
    }

    expect(z).toEqual(24)
    console.timeEnd('zeact')
  })
})
