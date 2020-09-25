import {renderHost} from '../lib/component-types/host/host-component'
import {RootNode} from '../lib/component-types/base'
import {renderTree} from '../lib/render'
import {div} from '../lib/host-components'
import {HostAttributes} from '../lib/host-component-types'

describe('simple div', () => {
  test('render host', () => {
    const root = mkRoot()

    renderHost('div', {}, root, null, 0)

    expect(root.element.innerHTML).toEqual('<div></div>')
  })

  test('update div', () => {
    const root = mkRoot()

    const host = renderHost('div', {}, root, null, 0)

    expect(root.element.innerHTML).toEqual('<div></div>')

    const host2 = renderHost<HostAttributes<'div'>>(
      'div',
      {className: 'simple'},
      root,
      host,
      0
    )

    expect(root.element.innerHTML).toEqual(`<div class="simple"></div>`)

    renderHost('div', {}, root, host2, 0)

    expect(root.element.innerHTML).toEqual('<div></div>')
  })

  test('remove child on next render', () => {
    const root = mkRoot()

    const h = div({children: [div('a'), div('b')]})

    const divs = renderTree(h, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const h2 = div({children: [div('a')]})

    renderTree(h2, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })

  test('remove child on next render2', () => {
    const root = mkRoot()

    const divs = renderTree(div({children: [div('a'), div('b')]}), null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    renderTree(div({children: [div('a')]}), divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })
})

export function mkRoot(): RootNode {
  return new RootNode(document.createElement('div'))
}
