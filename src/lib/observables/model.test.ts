import {makeModel} from './model'

describe('model', () => {
  // const A = class extends Model {
  //   $a = 2
  //
  //   get $c(): number {
  //     return this.$a * this.$a
  //   }
  // }.$()

  const B = makeModel(
    class B {
      $a = 2

      get $c(): number {
        return this.$a * this.$a
      }
    }
  )

  test('observables work as expected', () => {
    const instance = new B()

    expect(instance.$c).toEqual(4)

    instance.$a = 3

    expect(instance.$c).toEqual(9)
  })
})
