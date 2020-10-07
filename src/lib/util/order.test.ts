import {InsertedOrder, Order} from './order'

describe('Order.add comparisons', () => {
  test('1.1 < 1.2', () => {
    expect(Order.key('1', 1) < Order.key('1', 2)).toBe(true)
  })

  test('1.2 < 1.20', () => {
    expect(Order.key('1', 1) < Order.key('1', 20)).toBe(true)
  })
})

describe('insert', () => {
  const inserted: InsertedOrder[] = []
  const parentDiv = document.createElement('div')
  const a = document.createElement('div')
  const b = document.createElement('div')
  const c = document.createElement('div')
  const d = document.createElement('div')

  test('insert a div', () => {
    Order.insert(parentDiv, inserted, a, '13')

    expect(inserted).toEqual([{order: '13', element: a}])
  })

  test('insert after first', () => {
    Order.insert(parentDiv, inserted, b, '14')

    expect(inserted).toEqual([
      {order: '13', element: a},
      {order: '14', element: b},
    ])
  })

  test('insert before first', () => {
    Order.insert(parentDiv, inserted, c, '11')

    expect(inserted).toEqual([
      {order: '11', element: c},
      {order: '13', element: a},
      {order: '14', element: b},
    ])
  })

  test('insert in between', () => {
    Order.insert(parentDiv, inserted, d, '12')

    expect(inserted).toEqual([
      {order: '11', element: c},
      {order: '12', element: d},
      {order: '13', element: a},
      {order: '14', element: b},
    ])
  })
})
