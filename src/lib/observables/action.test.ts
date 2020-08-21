import {action, asyncAction, runInAction} from './action'
import {autoRun} from './responder'
import {val} from './observable'
import {computed} from './computed'
import {sleep} from '../../dom-tests/simple-switcher-z.test'

describe('action', () => {
  test('action batches updates', () => {
    const a = val(1)
    let count = 0

    autoRun(() => {
      count++
      a()
    })

    runInAction(() => {
      a(2)
      a(3)
      a(4)
    })

    expect(count).toEqual(2)
  })

  test('autorun supports setting', () => {
    const a = val(1)
    const b = val(2)
    let count = 0

    autoRun(() => {
      count++
      b(a() * 5)
    })

    expect(count).toEqual(1)
  })

  test('autoRun with computed inside behaves', () => {
    const a = val(2)
    const b = val(2)
    const c = computed(() => a() * b())
    let d: number = c()

    expect(c()).toEqual(4)

    let count = 0

    autoRun(() => {
      count++
      b(a() * 5)

      expect(b()).toEqual(10)

      // Computed needs to update now.
      expect(c()).toEqual(20)

      d = c()
    })

    expect(count).toEqual(1)
  })
})

describe('async action behaviour', () => {
  test('simple case', async () => {
    class Actions {
      num = val(1)

      updates = 0

      constructor() {
        autoRun(() => {
          this.num()
          this.updates++
        })
      }

      run = action(() => {
        this.num(2)
        this.num(3)
        this.num(4)
      })

      runAsync = action(async () => {
        this.num(2)
        await sleep(1)
        this.num(3)
        await sleep(1)
        this.num(4)
      })

      runAsync2 = asyncAction(async () => {
        this.num(2)
        await sleep(1)
        this.num(3)
        await sleep(1)
        this.num(4)
      })
    }

    const a = new Actions()

    await a.runAsync()

    expect(a.num()).toEqual(4)
    expect(a.updates).toEqual(4)

    a.num(1)
    a.run()

    expect(a.num()).toEqual(4)
    expect(a.updates).toEqual(6)

    a.num(1)
    await a.runAsync2()

    expect(a.num()).toEqual(4)
    expect(a.updates).toEqual(8)
  })
})
