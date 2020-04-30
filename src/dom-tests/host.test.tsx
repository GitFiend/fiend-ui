import {renderHost} from '../lib/component-types/host/host-component'
import {RootNode} from '../lib/component-types/base'

describe('simple div', () => {
  test('render host', () => {
    const root = mkRoot()

    renderHost('div', {}, null, root, null, 0)

    expect(root.element.innerHTML).toEqual('<div></div>')
  })

  test('update div', () => {
    const root = mkRoot()

    const host = renderHost('div', {}, null, root, null, 0)

    expect(root.element.innerHTML).toEqual('<div></div>')

    const host2 = renderHost('div', {className: 'simple'}, null, root, host, 0)

    expect(root.element.innerHTML).toEqual(`<div class="simple"></div>`)

    renderHost('div', {}, null, root, host2, 0)

    expect(root.element.innerHTML).toEqual('<div></div>')
  })
})

function mkRoot(): RootNode {
  return new RootNode(document.createElement('div'))
}
