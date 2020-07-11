import {div} from './host-components'
import {Component} from './component-types/component'
import {Subtree} from './component-types/base'
import {mkRoot} from '../dom-tests/host.test'
import {renderTree} from './render'

describe('div renders', () => {
  test('no args', () => {
    const el = div()

    expect(el).toEqual({
      type: 'div',
      props: null,
      children: [],
    })
  })

  test('single element arg', () => {
    const el = div('hello')

    expect(el).toEqual({
      type: 'div',
      props: null,
      children: ['hello'],
    })
  })

  test('single attribute arg', () => {
    const el = div({className: 'hi'})

    expect(el).toEqual({
      type: 'div',
      props: {className: 'hi'},
      children: [],
    })
  })

  test('both attributes and elements', () => {
    const el = div({className: 'hi'}, 'hello')

    expect(el).toEqual({
      type: 'div',
      props: {className: 'hi'},
      children: ['hello'],
    })
  })

  test('two elements only', () => {
    const el = div('hello', 'hello')

    expect(el).toEqual({
      type: 'div',
      props: null,
      children: ['hello', 'hello'],
    })
  })

  test('custom component', () => {
    const root = mkRoot()

    renderTree(A._(), null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div>omg</div>`)
  })
})

class A extends Component {
  render(): Subtree {
    return div('omg')
  }
}

// describe('test construction perf', () => {
//   const numLoops = 1000000
//   test('div2', () => {
//     timeF(() => {
//       let elements: Tree[] = []
//
//       for (let i = 0; i < numLoops; i++) {
//         elements.push(div2({style: {width: '100px'}}, div2(), div2(), div2()))
//       }
//
//       expect(elements.length).toEqual(numLoops)
//     }, 'div2')
//   })
//   test('div', () => {
//     timeF(() => {
//       let elements: Tree[] = []
//
//       for (let i = 0; i < numLoops; i++) {
//         elements.push(div({style: {width: '100px'}}, div(), div(), div()))
//       }
//
//       expect(elements.length).toEqual(numLoops)
//     }, 'div')
//   })
// })
