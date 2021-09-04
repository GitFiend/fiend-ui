import {Div} from '..'
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

    const h = Div({children: [Div('a'), Div('b')]})

    root.render(h)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const h2 = Div({children: [Div('a')]})

    root.render(h2)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })

  test('remove child on next render2', () => {
    const root = mkRoot()

    root.render(Div({children: [Div('a'), Div('b')]}))
    // const divs = renderTree(div({children: [div('a'), div('b')]}), null, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    root.render(Div({children: [Div('a')]}))
    // renderTree(div({children: [div('a')]}), divs, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)
  })
})
