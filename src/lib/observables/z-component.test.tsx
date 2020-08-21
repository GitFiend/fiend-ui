import {$Component} from './$-component'
import {$Val} from './observable'
import {Subtree} from '../component-types/base'
import {createElement} from '../create-element'
import {mkRoot} from '../../dom-tests/host.test'
import {renderTree} from '../render'
import {div} from '../host-components'
import {$} from '../component-types/component'

describe('ZComponent', () => {
  test('order', () => {
    const root = mkRoot()

    const store = new Store()

    const t = renderTree($(A, {store, depth: 3}), null, root, 0)

    expect(root.element.innerHTML).toEqual(
      '<div>5 - 3<div>5 - 2<div>5 - 1</div></div></div>'
    )

    store.num(6)

    console.log(root.element.innerHTML)

    expect(root.element.innerHTML).toEqual(
      '<div>6 - 3<div>6 - 2<div>6 - 1</div></div></div>'
    )
  })
})

class Store {
  num = $Val(5)
}

interface Props {
  store: Store
  depth: number
}

class A extends $Component<Props> {
  render(): Subtree | null {
    const {store, depth} = this.props

    if (depth <= 0) return null

    return div(`${store.num()} - ${depth}`, $(A, {store, depth: depth - 1}))
  }
}
