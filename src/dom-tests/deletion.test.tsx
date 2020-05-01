import {Component} from '../lib/component-types/component'
import {Subtree} from '../lib/component-types/base'
import {createElement} from '../lib/create-element'
import {mkRoot} from './host.test'
import {renderTree} from '../lib/render'

describe('deletion of custom component', () => {
  test('host inside custom', () => {
    const root = mkRoot()

    const c = (
      <C>
        <div>a</div>
        <div>b</div>
      </C>
    )

    const divs = renderTree(c, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = (
      <C>
        <div>a</div>
      </C>
    )

    renderTree(c2, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })

  test('custom inside custom', () => {
    const root = mkRoot()

    const c = (
      <C>
        <C>a</C>
        <C>b</C>
      </C>
    )

    const divs = renderTree(c, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = (
      <C>
        <C>a</C>
      </C>
    )

    renderTree(c2, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })
})

class C extends Component {
  render(): Subtree | null {
    const {children} = this.props

    return <div>{children}</div>
  }
}
