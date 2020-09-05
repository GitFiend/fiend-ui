import {makeObservable, zeact, fiend} from './make-observable'
import {$AutoRun} from './responder'
import {$Val} from './observable'
import {observable} from 'mobx'

describe('computed', () => {
  @zeact
  class Test {
    $a = 5
    $b = 6

    $f = () => 4
  }

  test('', () => {
    const t = new Test()

    $AutoRun(() => {
      console.log('value: ', t.$a)
    })

    t.$a = 100

    expect(t.$a).toEqual(100)
  })

  test('instanceof', () => {
    const a: any = () => 3
    const b: any = 5

    console.time('instanceof')
    for (let i = 0; i < 100_000; i++) {
      let res = a instanceof Function
      res = b instanceof Function
    }
    console.timeEnd('instanceof')
  })
})

@zeact
class A {
  $a = 5
  $b = 6
}

class B {
  a = $Val(5)
  b = $Val(6)
}

class C {
  $a = 5
  $b = 6

  constructor() {
    makeObservable(this)
  }
}

class D {
  @observable
  a = 5

  @observable
  b = 6
}

@fiend
class E {
  a = 5
  b = 6
}

describe('new zeact class construction speed', () => {
  const loops = 10_000

  timeConstructor(B, 'plain', loops)
  timeConstructor(A, 'decorator', loops)
  timeConstructor(C, 'in constructor', loops)
  timeConstructor(D, 'mobx', loops)
  timeConstructor(E, 'magic', loops)
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

describe('access and set observable speed', () => {
  const loops = 100_000

  test('plain', () => {
    console.time('plain')
    const c = new B()

    for (let i = 0; i < loops; i++) {
      c.a(c.a() + 1)
      c.b(c.a())
    }
    console.timeEnd('plain')
  })

  test('constructor', () => {
    console.time('constructor1')
    const c = new C()
    for (let i = 0; i < loops; i++) {
      c.$a = c.$a + 1
      c.$b = c.$a
    }
    console.timeEnd('constructor1')
  })

  test('mobx', () => {
    console.time('mobx')
    const c = new D()
    for (let i = 0; i < loops; i++) {
      c.a = c.a + 1
      c.b = c.a
    }
    console.timeEnd('mobx')
  })

  test('decorator', () => {
    console.time('decorator')
    const c = new A()
    for (let i = 0; i < loops; i++) {
      c.$a = c.$a + 1
      c.$b = c.$a
    }
    console.timeEnd('decorator')
  })

  test('magic', () => {
    console.time('magic')
    const c = new E()
    for (let i = 0; i < loops; i++) {
      c.a = c.a + 1
      c.b = c.a
    }
    console.timeEnd('magic')
  })
})

describe('makeObservable Alternative', () => {
  @fiend
  class Test {
    a = 4
    b = 3
    _c = 'omg'

    get n(): number {
      return this.a * this.b
    }
  }

  test('some numbers', () => {
    const t = new Test()

    $AutoRun(() => {
      console.log(t.n)
    })

    expect(t.a).toEqual(4)
    expect(t.b).toEqual(3)
    expect(t.n).toEqual(12)

    t.a = 2

    expect(t.a).toEqual(2)
    expect(t.n).toEqual(6)
  })
})

describe('check that only correct fields are modified', () => {
  @fiend
  class Test {
    a = 2

    b = () => {
      return this.a
    }

    e = 9

    get c(): number {
      return this.a * this.a
    }

    d(a: number) {
      this.a = a
    }
  }

  test('fields are as expected', () => {
    const t = new Test()

    const keys = Object.keys(t)
    const e = Object.entries(t)
    console.log(e)

    for (const k in t) {
      // @ts-ignore
      console.log(k, t[k] instanceof Function)
    }

    const descriptors = keys.map(key => {
      return {key, descriptor: Object.getOwnPropertyDescriptor(t, key)}
    })

    console.log(descriptors)
  })
})
