import {autorun, computed, IReactionDisposer, observable, runInAction} from 'mobx'
import {$AutoRun} from '../observables/responder'
import {makeObservable} from '../observables/$model'
import {$Calc, $Val} from '../observables/value-style'

xdescribe('compare mbox computeds with fiend-ui', () => {
  const loops = 1000

  test('time b', () => {
    class A {
      @observable
      a = 5

      @observable
      b = 5

      @observable
      c = 5

      @observable.ref
      d = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }

    class RunA {
      a = new A()

      disposer: IReactionDisposer

      constructor() {
        this.disposer = autorun(() => {
          const {a, b, c, d} = this.a

          this.a.d = [...d, a, b, c]
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

      a.disposer()
    }
    expect(z).toEqual(24)

    console.timeEnd('mobx')
  })

  test('fiend-ui', () => {
    class E {
      a = $Val(5)

      b = $Val(5)

      c = $Val(5)

      d = $Val([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }

    class Run {
      b = new E()

      constructor() {
        $AutoRun(() => {
          const {a, b, c, d} = this.b

          const array = [...d()]

          array.push(a(), b(), c())

          d(array)
        })
      }
    }

    console.time('fiend-ui')
    let z = 0
    for (let i = 0; i < loops; i++) {
      const r = new Run()

      const c = $Calc(() => {
        return r.b.a() + r.b.b() + r.b.c()
      })

      r.b.a(10)
      r.b.a(12)
      r.b.a(14)
      z = c()
      // console.log('fiend-ui', z)
    }

    expect(z).toEqual(24)
    console.timeEnd('fiend-ui')
  })

  test('fiend', () => {
    class E {
      $a = 5

      $b = 5

      $c = 5

      $d = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      constructor() {
        makeObservable(this)
      }
    }

    class Run {
      b = new E()

      constructor() {
        $AutoRun(() => {
          const {$a, $b, $c, $d} = this.b

          this.b.$d = [...$d, $a, $b, $c]
        })
      }
    }

    console.time('fiend')
    let z = 0
    for (let i = 0; i < loops; i++) {
      const r = new Run()

      const c = $Calc(() => {
        return r.b.$a + r.b.$b + r.b.$c
      })

      r.b.$a = 10
      r.b.$a = 12
      r.b.$a = 14
      z = c()
      // console.log('fiend-ui', z)
    }

    expect(z).toEqual(24)
    console.timeEnd('fiend')
  })
})
