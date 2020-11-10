import {Order} from './order'
import {mkRoot} from '../../dom-tests/host.test'
import {HostComponent} from '../component-types/host/host-component'
import {ElementNamespace} from './element'
import {ElementComponent} from '../component-types/base-component'
import {RunStack} from '../observables/run-stack'

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
  RunStack.runInsertions()
  const {inserted} = parent

  test('try different insert indices', () => {
    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 3)
    RunStack.runInsertions()
    expect(inserted.map(i => i.order)).toEqual(['103'])
    checkOrder(inserted)

    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 4)
    RunStack.runInsertions()
    expect(inserted.map(i => i.order)).toEqual(['103', '104'])
    checkOrder(inserted)

    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 1)
    RunStack.runInsertions()
    expect(inserted.map(i => i.order)).toEqual(['101', '103', '104'])
    checkOrder(inserted)

    new HostComponent('div', ElementNamespace.html, {}, parent, parent, 2)
    RunStack.runInsertions()
    expect(inserted.map(i => i.order)).toEqual(['101', '102', '103', '104'])
    checkOrder(inserted)
  })
})

export function checkOrder(inserted: ElementComponent[]) {
  let prev: ElementComponent | null = null

  for (const c of inserted) {
    if (prev !== null) {
      expect(prev.element).toBe(c.element.previousElementSibling)
    }
    prev = c
  }
}
