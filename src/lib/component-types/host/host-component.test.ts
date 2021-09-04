import {Div} from './host-components'
import {PureComponent} from '../pure-component'
import {FiendNode} from '../../..'
import {ElementNamespace, ElementType} from '../../util/element'
import {mkRoot} from '../../../dom-tests/test-helpers'

describe('div renders', () => {
  test('no args', () => {
    const el = Div({children: []})

    expect(el).toEqual({
      elementType: ElementType.host,
      _type: 'div',
      namespace: ElementNamespace.html,
      props: {children: []},
    })
  })

  test('single element arg', () => {
    const el = Div('hello')

    expect(el).toEqual({
      elementType: ElementType.host,
      _type: 'div',
      namespace: ElementNamespace.html,
      props: {children: ['hello']},
    })
  })

  test('single attribute arg', () => {
    const el = Div({className: 'hi'})

    expect(el).toEqual({
      elementType: ElementType.host,
      _type: 'div',
      namespace: ElementNamespace.html,
      props: {className: 'hi'},
    })
  })

  test('both attributes and elements', () => {
    const el = Div({className: 'hi', children: ['hello']})

    expect(el).toEqual({
      elementType: ElementType.host,
      _type: 'div',
      namespace: ElementNamespace.html,
      props: {className: 'hi', children: ['hello']},
    })
  })

  test('two elements only', () => {
    const el = Div({children: ['hello', 'hello']})

    expect(el).toEqual({
      elementType: ElementType.host,
      _type: 'div',
      namespace: ElementNamespace.html,
      props: {children: ['hello', 'hello']},
    })
  })

  test('render to dom', () => {
    const root = mkRoot()

    root.render(Div({children: ['omg']}))

    expect(root.element.innerHTML).toEqual(`<div>omg</div>`)
  })

  test('custom component', () => {
    const root = mkRoot()

    root.render(A.$({}))

    expect(root.element.innerHTML).toEqual(`<div>omg</div>`)
  })
})

class A extends PureComponent {
  render(): FiendNode {
    return Div('omg')
  }
}

// describe('isPropsObject', () => {
//   test('number', () => {
//     expect(isPropsObject(3)).toEqual(false)
//
//     const n = 12
//
//     expect(isPropsObject(n)).toEqual(false)
//   })
//
//   test('strings', () => {
//     expect(isPropsObject('omg')).toEqual(false)
//   })
//
//   test('null', () => {
//     expect(isPropsObject(null)).toEqual(false)
//     expect(isPropsObject(undefined)).toEqual(false)
//   })
//
//   test('host components', () => {
//     expect(isPropsObject(div({}))).toEqual(false)
//   })
//
//   test('custom components', () => {
//     class A extends Component {
//       render(): Subtree {
//         return div('omg')
//       }
//     }
//
//     expect(isPropsObject(A)).toEqual(false)
//     expect(isPropsObject(A.$({}))).toEqual(false)
//   })
//
//   test('possible objects', () => {
//     expect(isPropsObject({})).toEqual(true)
//     expect(isPropsObject({style: s`height: 10px`})).toEqual(true)
//   })
// })

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
