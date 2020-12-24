import {div} from '..'
import {mkRoot} from './test-helpers'

describe('simple div', () => {
  // xtest('render host', () => {
  //   const root = mkRoot()
  //
  //   renderHost('div', {}, null, root.order, 0)
  //
  //   expect(root.element.innerHTML).toEqual('<div></div>')
  // })
  //
  // xtest('update div', () => {
  //   const root = mkRoot()
  //
  //   const host = renderHost('div', {}, null, root.order, 0)
  //
  //   expect(root.element.innerHTML).toEqual('<div></div>')
  //
  //   const host2 = renderHost<HostAttributes<'div'>>(
  //     'div',
  //     {className: 'simple'},
  //     host,
  //     root.order,
  //     0
  //   )
  //
  //   expect(root.element.innerHTML).toEqual(`<div class="simple"></div>`)
  //
  //   renderHost('div', {}, host2, root.order, 0)
  //
  //   expect(root.element.innerHTML).toEqual('<div></div>')
  // })

  test('remove child on next render', () => {
    const root = mkRoot()

    const h = div({children: [div('a'), div('b')]})

    root.render(h)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const h2 = div({children: [div('a')]})

    root.render(h2)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })

  test('remove child on next render2', () => {
    const root = mkRoot()

    root.render(div({children: [div('a'), div('b')]}))
    // const divs = renderTree(div({children: [div('a'), div('b')]}), null, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    root.render(div({children: [div('a')]}))
    // renderTree(div({children: [div('a')]}), divs, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })
})
