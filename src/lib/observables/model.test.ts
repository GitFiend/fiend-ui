import {makeModel, Model} from './model'
import {makeObservable} from './make-observable'

describe('model', () => {
  // const A = class extends Model {
  //   $a = 2
  //
  //   get $c(): number {
  //     return this.$a * this.$a
  //   }
  // }.$()

  const B = makeModel(
    class {
      $a = 2

      get $c(): number {
        return this.$a * this.$a
      }
    }
  )

  const B2 = class extends Model {
    $a = 2

    get $c(): number {
      return this.$a * this.$a
    }
  }.$()

  class B3 {
    constructor() {
      makeObservable(this, B3)
    }

    $a = 2

    get $c(): number {
      return this.$a * this.$a
    }
  }

  test('observables work as expected', () => {
    const instance = new B3()

    expect(instance.$c).toEqual(4)

    instance.$a = 3

    expect(instance.$c).toEqual(9)
  })
})
