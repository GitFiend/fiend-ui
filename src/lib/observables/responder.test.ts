import {$Val} from './observable'
import {$Calc} from './computed'
import {$AutoRun, $Reaction} from './responder'
import {model} from './$model'
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

describe('construction speed', () => {
  const num = 1_000_000

  test('time things', () => {
    console.time('array')
    let a
    for (let i = 0; i < num; i++) {
      a = [i]
    }
    console.timeEnd('array')

    console.time('array2')
    let d
    for (let i = 0; i < num; i++) {
      d = Array.from([])
    }
    console.timeEnd('array2')

    console.time('object')
    let b
    for (let i = 0; i < num; i++) {
      b = {a: i}
    }
    console.timeEnd('object')

    console.time('map')
    let c
    for (let i = 0; i < num; i++) {
      c = new Map()
    }
    console.timeEnd('map')

    expect(true).toBeTruthy()
  })
})

describe('map vs object', () => {
  const o = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
  }

  const m = new Map<string, number>()

  m.set('a', 1)
  m.set('b', 2)
  m.set('c', 3)
  m.set('d', 4)
  m.set('e', 5)
  m.set('f', 6)
  m.set('g', 7)
  m.set('h', 8)
  m.set('i', 9)
  m.set('j', 10)
  m.set('k', 11)
  m.set('l', 12)

  const num = 100_000

  test('object', () => {
    let n = 0

    console.time('object')

    for (let i = 0; i < num; i++) {
      // const keys = Object.keys(o) as (keyof typeof o)[]
      //
      // for (const key of keys) {
      //   n = o[key]
      // }

      for (const key in o) {
        n = o[key as keyof typeof o]
      }
    }

    console.timeEnd('object')

    expect(n).toEqual(12)
  })

  test('map', () => {
    let n = 0

    console.time('map')

    for (let i = 0; i < num; i++) {
      for (const [, value] of m) {
        n = value
      }
    }

    console.timeEnd('map')

    expect(n).toEqual(12)
  })
})

describe('$AutoRun cleanup', () => {
  let count = 0
  const n = $Val<number>(1)
  let dispose: () => void

  test('autorun', () => {
    dispose = $AutoRun(() => {
      n()
      count++
    })

    expect(count).toEqual(1)
    n(2)
    expect(count).toEqual(2)
  })

  test('out of scope, no cleanup', () => {
    // a.end()
    n(3)
    expect(count).toEqual(3)
  })

  test('out of scope, with cleanup', () => {
    dispose()
    n(4)
    expect(count).toEqual(3)
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

    a()
  })

  test('out of scope', () => {
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

  @model
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
      a.$num2
    })

    expect(count).toEqual(1)
    n(n() + 1)
    expect(count).toEqual(2)

    d()
  })

  xtest('out of scope', () => {
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
    const before = count

    n.set(n.get() + 1)
    n.set(n.get() + 1)
    n.set(n.get() + 1)
    n.set(n.get() + 1)

    expect(count).toEqual(before)
  })
})
