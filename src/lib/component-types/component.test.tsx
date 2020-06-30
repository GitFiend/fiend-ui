import {Component} from './component'
import {createElement} from '../create-element'
import {mkRoot} from '../../dom-tests/host.test'
import {renderTree} from '../render'

describe('component', () => {
  test('', () => {
    const root = mkRoot()

    const t = renderTree(<A ok={true} />, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div>OK</div>`)

    renderTree(<A ok={false} />, t, root, 0)

    expect(root.element.innerHTML).toEqual(``)
  })
})

class A extends Component<{ok: boolean}> {
  render() {
    const {ok} = this.props

    if (!ok) return null
    return <div>OK</div>
  }
}
