import {$Val} from './observable'
import {$Calc} from './computed'
import {$AutoRun, $Reaction} from './responder'

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
  const n = $Val(1)

  test('init reaction', () => {
    let i = 0

    const a: any = $AutoRun(() => {
      i = n()
      count++
    })

    expect(count).toEqual(1)
    n(n() + 1)
    expect(count).toEqual(2)

    a.run = null
  })

  test('out of scope', () => {
    n(n() + 1)
    expect(count).toEqual(3)
  })
})
