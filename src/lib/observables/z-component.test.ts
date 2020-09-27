import {$Component} from './$-component'
import {Subtree} from '../component-types/base'
import {mkRoot} from '../../dom-tests/host.test'
import {renderTree} from '../render'
import {div} from '../host-components'
import {model} from './make-observable'
import {Component} from '../component-types/component'

describe('$Component', () => {
  test('order 1', () => {
    @model
    class Store {
      $num = 5
    }

    interface Props {
      store: Store
      depth: number
    }

    class A extends $Component<Props> {
      render(): Subtree | null {
        const {store, depth} = this.props

        if (depth <= 0) return null

        return div({
          children: [`${store.$num} - ${depth}`, A.$({store, depth: depth - 1})],
        })
      }
    }

    const root = mkRoot()
    const store = new Store()

    renderTree(A.$({store, depth: 3}), null, root, 0)

    expect(root.containerElement.innerHTML).toEqual(
      '<div>5 - 3<div>5 - 2<div>5 - 1</div></div></div>'
    )

    store.$num = 6

    expect(root.containerElement.innerHTML).toEqual(
      '<div>6 - 3<div>6 - 2<div>6 - 1</div></div></div>'
    )
  })

  test('order without keys', () => {
    const root = mkRoot()

    const a = div({children: [div('a')]})
    // render(a, document.body)
    const prev = renderTree(a, null, root, 0)

    expect(root.containerElement.innerHTML).toEqual('<div><div>a</div></div>')

    const b = div({children: [div('b'), div('a')]})
    // render(b, document.body)
    renderTree(b, prev, root, 0)

    expect(root.containerElement.innerHTML).toEqual('<div><div>b</div><div>a</div></div>')
  })

  test('order, no keys, custom component', () => {
    const root = mkRoot()

    class Div extends Component {
      render(): Subtree {
        return div({children: this.props.children})
      }
    }

    const a = Div.$({children: [Div.$({children: ['a']})]})
    // render(a, document.body)
    const prev = renderTree(a, null, root, 0)

    expect(root.containerElement.innerHTML).toEqual('<div><div>a</div></div>')

    const b = Div.$({children: [Div.$({children: ['b']}), Div.$({children: ['a']})]})
    // render(b, document.body)
    renderTree(b, prev, root, 0)

    expect(root.containerElement.innerHTML).toEqual('<div><div>b</div><div>a</div></div>')
  })

  test('order 2, without keys', () => {
    const root = mkRoot()

    const a = div({children: [div('a'), div('b'), div('c')]})
    // render(a, document.body)
    const prev = renderTree(a, null, root, 0)

    expect(root.containerElement.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>'
    )

    const b = div({children: [div('d'), div('a'), div('b'), div('c')]})
    // render(b, document.body)
    renderTree(b, prev, root, 0)

    expect(root.containerElement.innerHTML).toEqual(
      '<div><div>d</div><div>a</div><div>b</div><div>c</div></div>'
    )
  })

  test('order 3, with keys', () => {
    const root = mkRoot()

    const a = div({
      children: [
        div({children: ['a'], key: 'a'}),
        div({children: ['b'], key: 'b'}),
        div({children: ['c'], key: 'c'}),
      ],
    })
    // render(a, document.body)
    const prev = renderTree(a, null, root, 0)

    expect(root.containerElement.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>'
    )

    const b = div({
      children: [
        div({children: ['d'], key: 'd'}),
        div({children: ['a'], key: 'a'}),
        div({children: ['b'], key: 'b'}),
        div({children: ['c'], key: 'c'}),
      ],
    })
    // render(b, document.body)
    renderTree(b, prev, root, 0)

    expect(root.containerElement.innerHTML).toEqual(
      '<div><div>d</div><div>a</div><div>b</div><div>c</div></div>'
    )
  })
})
