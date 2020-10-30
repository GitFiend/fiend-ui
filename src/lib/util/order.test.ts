import {Order} from './order'
import {mkRoot} from '../../dom-tests/host.test'
import {HostComponent} from '../component-types/host/host-component'
import {ElementNamespace} from './element'

describe('Order.add comparisons', () => {
  test('1.1 < 1.2', () => {
    expect(Order.key('1', 1) < Order.key('1', 2)).toBe(true)
  })

  test('1 3 < 1 20', () => {
    expect(Order.key('1', 3) < Order.key('1', 20)).toBe(true)
  })
})

describe('insert', () => {
  const root = mkRoot()

  const parent = new HostComponent('div', ElementNamespace.html, {}, root, root, 0)
  const {inserted} = parent

  test('try different insert indices', () => {
    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 3)
    expect(inserted.map(i => i.order)).toEqual(['103'])

    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 4)
    expect(inserted.map(i => i.order)).toEqual(['103', '104'])

    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 1)
    expect(inserted.map(i => i.order)).toEqual(['101', '103', '104'])

    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 2)
    expect(inserted.map(i => i.order)).toEqual(['101', '102', '103', '104'])
  })
})
