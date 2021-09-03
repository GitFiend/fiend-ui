import {$Component} from './$component'
import {div, FiendNode, makeObservable, PureComponent} from '../..'
import {mkRoot} from '../../dom-tests/test-helpers'

describe('$Component', () => {
  test('order 1', () => {
    class Store {
      $num = 5

      constructor() {
        makeObservable(this)
      }
    }

    interface Props {
      store: Store
      depth: number
    }

    class A extends $Component<Props> {
      render(): FiendNode | null {
        const {store, depth} = this.props

        if (depth <= 0) return null

        return div({
          children: [`${store.$num} - ${depth}`, A.$({store, depth: depth - 1})],
        })
      }
    }

    const root = mkRoot()
    const store = new Store()

    root.render(A.$({store, depth: 3}))

    expect(root.element.innerHTML).toEqual(
      '<div>5 - 3<div>5 - 2<div>5 - 1</div></div></div>'
    )

    store.$num = 6

    expect(root.element.innerHTML).toEqual(
      '<div>6 - 3<div>6 - 2<div>6 - 1</div></div></div>'
    )
  })

  test('order without keys', () => {
    const root = mkRoot()

    const a = div({children: [div('a')]})

    root.render(a)

    expect(root.element.innerHTML).toEqual('<div><div>a</div></div>')

    const b = div({children: [div('b'), div('a')]})

    root.render(b)

    expect(root.element.innerHTML).toEqual('<div><div>b</div><div>a</div></div>')
  })

  test('order, no keys, custom component', () => {
    const root = mkRoot()

    class DivC extends PureComponent {
      render(): FiendNode {
        return div({children: this.props.children})
      }
    }

    const a = DivC.$({children: [DivC.$({children: ['a']})]})

    root.render(a)

    expect(root.element.innerHTML).toEqual('<div><div>a</div></div>')

    const b = DivC.$({children: [DivC.$({children: ['b']}), DivC.$({children: ['a']})]})

    root.render(b)

    expect(root.element.innerHTML).toEqual('<div><div>b</div><div>a</div></div>')
  })

  test('order 2, without keys', () => {
    const root = mkRoot()

    const a = div({children: [div('a'), div('b'), div('c')]})

    root.render(a)

    expect(root.element.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>'
    )

    const b = div({children: [div('d'), div('a'), div('b'), div('c')]})

    root.render(b)

    expect(root.element.innerHTML).toEqual(
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

    root.render(a)

    expect(root.element.innerHTML).toEqual(
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

    root.render(b)

    expect(root.element.innerHTML).toEqual(
      '<div><div>d</div><div>a</div><div>b</div><div>c</div></div>'
    )
  })
})
