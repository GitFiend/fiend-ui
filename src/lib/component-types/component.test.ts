import {Component} from './component'
import {mkRoot} from '../../dom-tests/host.test'
import {renderTree} from '../render'
import {div} from '../host-components'

describe('component', () => {
  test('null in render should remove previous elements', () => {
    const root = mkRoot()

    const t = renderTree(A.$({ok: true}), null, root, 0)

    expect(root.containerElement.innerHTML).toEqual(`<div>OK</div>`)

    renderTree(A.$({ok: false}), t, root, 0)

    expect(root.containerElement.innerHTML).toEqual(``)
  })
})

class A extends Component<{ok: boolean}> {
  render() {
    const {ok} = this.props

    if (!ok) return null
    return div('OK')
  }
}

class Base {
  n = 5

  static new() {
    return new this()
  }
}

class B extends Base {
  n = 6
}

describe('quick static test', () => {
  test('it', () => {
    const b = B.new()

    expect(b.n).toEqual(6)
  })
})

// describe('retrieve first element', () => {
//   test('single child', () => {
//     class Div extends Component {
//       render() {
//         return div({children: this.props.children, className: 'Div'})
//       }
//     }
//
//     const root = mkRoot()
//     const cmp = renderTree(
//       Div.$({children: [div({children: ['a'], className: 'a'})]}),
//       null,
//       null,
//       root,
//       0
//     )
//
//     const el = cmp.firstElement as HTMLDivElement
//
//     expect(el.className).toEqual('Div')
//   })
//
//   test('single child nested', () => {
//     class Div extends Component {
//       render() {
//         return Div2.$({})
//       }
//     }
//
//     class Div2 extends Component {
//       render() {
//         return div({children: this.props.children, className: 'Div'})
//       }
//     }
//
//     const root = mkRoot()
//     const cmp = renderTree(Div.$({}), null, null, root, 0)
//
//     const el = cmp.firstElement as HTMLDivElement
//
//     expect(el.className).toEqual('Div')
//   })
// })
