import {makeObservable} from './$model'
import {$AutoRun} from './responder'
import {observable} from 'mobx'
import {$Val} from './value-style'

class Model {
  $a = 5
  $b = 6

  constructor() {
    makeObservable(this)
  }
}

class Val {
  a = $Val(5)
  b = $Val(6)
}

class Mobx {
  @observable
  a = 5

  @observable
  b = 6
}

describe('new fiend-ui class construction speed', () => {
  const loops = 10_000

  timeConstructor(Val, 'plain', loops)
  timeConstructor(Model, 'decorator', loops)
  timeConstructor(Mobx, 'mobx', loops)
  timeConstructor2('static', loops)

  console.time('cold construction')
  new Model()
  console.timeEnd('cold construction')
})

function timeConstructor<T extends {new (...args: any[]): {}}>(
  C: T,
  name: string,
  loops: number
) {
  test(name, () => {
    console.time(name)
    let c
    for (let i = 0; i < loops; i++) {
      c = new C()
    }
    console.timeEnd(name)
  })
}

function timeConstructor2(name: string, loops: number) {
  test(name, () => {
    console.time(name)
    const t = Date.now()

    let c
    for (let i = 0; i < loops; i++) {
      c = new Model()
    }

    const duration = Date.now() - t
    console.log(`${name} took ${duration}ms, ${duration / loops}ms each`)
    console.timeEnd(name)
  })
}

describe('access and set observable speed', () => {
  const loops = 100_000

  test('plain', () => {
    console.time('plain')
    const c = new Val()

    for (let i = 0; i < loops; i++) {
      c.a(c.a() + 1)
      c.b(c.a())
    }
    console.timeEnd('plain')
  })

  test('mobx', () => {
    console.time('mobx')
    const c = new Mobx()
    for (let i = 0; i < loops; i++) {
      c.a = c.a + 1
      c.b = c.a
    }
    console.timeEnd('mobx')
  })

  test('decorator', () => {
    console.time('decorator')
    const c = new Model()
    for (let i = 0; i < loops; i++) {
      c.$a = c.$a + 1
      c.$b = c.$a
    }
    console.timeEnd('decorator')
  })
})

describe('makeObservable Alternative', () => {
  class Test {
    $a = 4
    $b = 3
    c = 'omg'

    constructor() {
      makeObservable(this)
    }

    get $n(): number {
      return this.$a * this.$b
    }
  }

  test('some numbers', () => {
    const t = new Test()

    $AutoRun(() => {
      console.log(t.$n)
    })

    expect(t.$a).toEqual(4)
    expect(t.$b).toEqual(3)
    expect(t.$n).toEqual(12)

    t.$a = 2

    expect(t.$a).toEqual(2)
    expect(t.$n).toEqual(6)
  })
})

describe('check that only correct fields are modified', () => {
  let computedRuns = 0

  class Test2 {
    $a = 2
    e = 9

    b(): number {
      return this.$a
    }

    constructor() {
      makeObservable(this)
    }

    get $c(): number {
      computedRuns++
      return this.$a * this.$a
    }

    d(a: number): void {
      this.$a = a
    }
  }

  test('fields are as expected', () => {
    const t = new Test2()

    const entries = t as any
    expect(entries['__$a']).toBeDefined()
    expect(entries['__$c']).toBeDefined()
    expect(entries['__e']).toBeFalsy()
    expect(entries['__d']).toBeFalsy()

    expect(computedRuns).toEqual(0)
    expect(t.$c).toEqual(4)
    expect(computedRuns).toEqual(1)

    t.$a = 3
    expect(t.$c).toEqual(9)

    expect(computedRuns).toEqual(2)
  })
})
