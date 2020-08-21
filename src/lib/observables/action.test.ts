import {$Action, $AsyncAction, $RunInAction} from './action'
import {$AutoRun} from './responder'
import {$Val} from './observable'
import {$Computed} from './computed'
import {sleep} from '../../dom-tests/simple-switcher-z.test'

describe('action', () => {
  test('action batches updates', () => {
    const a = $Val(1)
    let count = 0

    $AutoRun(() => {
      count++
      a()
    })

    $RunInAction(() => {
      a(2)
      a(3)
      a(4)
    })

    expect(count).toEqual(2)
  })

  test('autorun supports setting', () => {
    const a = $Val(1)
    const b = $Val(2)
    let count = 0

    $AutoRun(() => {
      count++
      b(a() * 5)
    })

    expect(count).toEqual(1)
  })

  test('autoRun with computed inside behaves', () => {
    const a = $Val(2)
    const b = $Val(2)
    const c = $Computed(() => a() * b())
    let d: number = c()

    expect(c()).toEqual(4)

    let count = 0

    $AutoRun(() => {
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
      num = $Val(1)

      updates = 0

      constructor() {
        $AutoRun(() => {
          this.num()
          this.updates++
        })
      }

      run = $Action(() => {
        this.num(2)
        this.num(3)
        this.num(4)
      })

      runAsync = $Action(async () => {
        this.num(2)
        await sleep(1)
        this.num(3)
        await sleep(1)
        this.num(4)
      })

      runAsync2 = $AsyncAction(async () => {
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
