import {makeObservable} from '../$model'
import {$Change} from './change'

describe('$Change', () => {
  class Store {
    $o: 'start' | 'middle' | 'end' = 'start'

    constructor() {
      makeObservable(this)
    }
  }

  test('wait for new value with promise', async () => {
    const s = new Store()

    expect(s.$o).toBe('start')

    const next = $Change(s, '$o')

    s.$o = 'middle'

    expect(await next).toBe('middle')

    const next2 = $Change(s, '$o')

    s.$o = 'end'

    expect(await next2).toBe('end')
  })
})
