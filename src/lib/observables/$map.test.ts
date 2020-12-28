import {$Map} from './$map'
import {makeObservable} from './$model'
import {$AutoRun} from './responder'

describe('$Map', () => {
  test('set', () => {
    const m = new $Map<string, number>()

    expect(m._count).toBe(0)

    m.set('a', 1)

    expect(m.size).toBe(1)
    expect(m._count).toBe(1)
  })

  test('notify', () => {
    const m = new $Map<string, number>()

    class A {
      constructor() {
        makeObservable(this)
      }

      get $sum(): number {
        let sum = 0

        m.forEach(value => {
          sum += value
        })

        return sum
      }
    }

    const a = new A()
    let count = 0

    $AutoRun(() => {
      a.$sum
      count++
    })

    expect(count).toBe(1)

    m.set('a', 1)

    expect(m.size).toBe(1)
    expect(count).toBe(2)
    expect(a.$sum).toBe(1)

    m.set('b', 5)

    expect(m.size).toBe(2)
    expect(count).toBe(3)
    expect(a.$sum).toBe(6)
  })
})
