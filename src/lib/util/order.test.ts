import {Order} from './order'
import {mkRoot} from '../../dom-tests/host.test'
import {HostComponent} from '../component-types/host/host-component'

describe('Order.add comparisons', () => {
  test('1.1 < 1.2', () => {
    expect(Order.key('1', 1) < Order.key('1', 2)).toBe(true)
  })

  test('1.2 < 1.20', () => {
    expect(Order.key('1', 1) < Order.key('1', 20)).toBe(true)
  })
})

describe('insert', () => {
  const root = mkRoot()

  const parent = new HostComponent('div', {}, root, '1', 0)
  const {inserted} = parent

  test('try different insert indices', () => {
    new HostComponent('div', {}, parent, parent.order, 3)
    expect(inserted.map(i => i.order)).toEqual(['103'])

    new HostComponent('div', {}, parent, parent.order, 4)
    expect(inserted.map(i => i.order)).toEqual(['103', '104'])

    new HostComponent('div', {}, parent, parent.order, 1)
    expect(inserted.map(i => i.order)).toEqual(['101', '103', '104'])

    new HostComponent('div', {}, parent, parent.order, 2)
    expect(inserted.map(i => i.order)).toEqual(['101', '102', '103', '104'])
  })
})
