import {OArray, OElement} from './o-array'

describe('OArray operations', () => {
  const a = {order: 'a'}
  const b = {order: 'b'}
  const c = {order: 'c'}
  const z = {order: 'z'}

  test('inserts at correct location', () => {
    const array: OElement[] = []

    OArray.insert(array, c)
    expect(array).toEqual([c])

    OArray.insert(array, a)
    expect(array).toEqual([a, c])
    OArray.insert(array, a)
    expect(array).toEqual([a, c])

    OArray.insert(array, z)
    expect(array).toEqual([a, c, z])

    OArray.insert(array, b)
    expect(array).toEqual([a, b, c, z])
  })

  test('remove elements', () => {
    const array = [a, b, c, z]

    OArray.remove(array, b)
    expect(array).toEqual([a, c, z])
  })
})
