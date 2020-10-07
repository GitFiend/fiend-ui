import {Order} from './order'

describe('Order.add comparisons', () => {
  test('1.1 < 1.2', () => {
    expect(Order.key('1', 1) < Order.key('1', 2)).toBe(true)
  })

  test('1.2 < 1.20', () => {
    expect(Order.key('1', 1) < Order.key('1', 20)).toBe(true)
  })
})
