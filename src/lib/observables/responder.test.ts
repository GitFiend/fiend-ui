import {$Val} from './observable'
import {$Calc} from './computed'
import {$AutoRun, $Reaction} from './responder'
import {fiend2} from './make-observable'
import {autorun, computed, observable} from 'mobx'

describe('reaction tests', () => {
  test('basic reaction', () => {
    const n = $Val(4)

    const sqr = $Calc(() => n() * n())

    let out = 0
    $Reaction(
      () => sqr(),
      result => {
        out = result
      }
    )

    n(2)
    expect(out).toEqual(4)

    n(3)
    expect(out).toEqual(9)
  })
})

describe('proxy test', () => {
  type Target = {message2: string; message1: string}

  const target: Target = {
    message1: 'hello',
    message2: 'everyone',
  }

  const handler2 = {
    get(target: Target, prop: keyof Target) {
      return target[prop]
    },
  }

  const proxy = new Proxy(target, handler2)

  const loops = 1000000

  test('proxy speed', () => {
    console.time('proxy')

    for (let i = 0; i < loops; i++) {
      const m1 = proxy.message1
      const m2 = proxy.message2
    }

    console.timeEnd('proxy')
  })

  test('normal access speed', () => {
    console.time('normy')

    for (let i = 0; i < loops; i++) {
      const m1 = target.message1
      const m2 = target.message2
    }

    console.timeEnd('normy')
  })
})

describe('reaction scope', () => {
  let count = 0
  const n = $Val<number>(1)

  test('init reaction', () => {
    let i = 0

    const a = $AutoRun(() => {
      i = n()
      count++
    })

    expect(count).toEqual(1)
    n(n() + 1)
    expect(count).toEqual(2)

    a.end()
  })

  test('out of scope', () => {
    console.log('out of scope')

    const before = count

    n(n() + 1)
    n(n() + 1)
    n(n() + 1)
    n(n() + 1)
    expect(count).toEqual(before)
  })
})

/*
When a class with a computed goes out of scope we want any computeds referencing
external observables to stop running.
 */
describe('computed scope', () => {
  let count = 0

  const n = $Val<number>(1)

  /*
  The computed is inside n's responder list. The computed doesn't have any
  responders. If it doesn't have any responders, then it shouldn't be inside n's list?

  When n changes, it calls $num's run method. $num has no responders. It shouldn't run unless
  it's called via a get().
   */

  @fiend2
  class A {
    get $num(): number {
      count++
      return n() * n()
    }

    get $num2(): number {
      return this.$num
    }
  }

  test('init computed', () => {
    const a = new A()

    const d = $AutoRun(() => {
      console.log(a.$num2)
    })

    expect(count).toEqual(1)
    n(n() + 1)
    expect(count).toEqual(2)

    d.end()
  })

  test('out of scope', () => {
    console.log('out of scope')

    const before = count

    n(n() + 1)
    n(n() + 1)
    n(n() + 1)
    n(n() + 1)

    expect(count).toEqual(before)
  })
})

describe('mobx computed scope', () => {
  let count = 0

  const n = observable.box(1)

  class A {
    @computed
    get num(): number {
      count++
      return n.get() * n.get()
    }

    @computed
    get num2(): number {
      return this.num
    }
  }

  test('init computed', () => {
    const a = new A()

    const d = autorun(() => {
      console.log(a.num2)
    })

    expect(count).toEqual(1)
    n.set(n.get() + 1)
    expect(count).toEqual(2)

    d()
  })

  test('out of scope', () => {
    console.log('out of scope')

    const before = count

    n.set(n.get() + 1)
    n.set(n.get() + 1)
    n.set(n.get() + 1)
    n.set(n.get() + 1)

    expect(count).toEqual(before)
  })
})
