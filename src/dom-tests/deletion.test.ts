import {PureComponent} from '..'
import {render} from '..'
import {div, h1} from '..'
import {FiendNode} from '..'
import {mkRoot} from './test-helpers'

describe('deletion of custom component', () => {
  test('host inside host', () => {
    const root = mkRoot()

    const c = div({children: [div('a'), div('b')]})

    root.render(c)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = div({children: [div('a')]})

    root.render(c2)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    const c3 = div({children: [div('a'), div('b')]})

    root.render(c3)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('host inside custom', () => {
    const root = mkRoot()

    const c = C.$({children: [div('a'), div('b')]})

    root.render(c)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = C.$({children: [div('a')]})

    root.render(c2)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    const c3 = C.$({children: [div('a'), div('b')]})

    root.render(c3)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('custom inside custom', () => {
    const root = mkRoot()

    let c = C.$({children: [C.$({children: ['a']}), C.$({children: ['b']})]})

    root.render(c)
    // let divs = renderTree(c, null, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    c = C.$({children: [C.$({children: ['a']})]})

    root.render(c)
    // divs = renderTree(c, divs, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    c = C.$({children: [C.$({children: ['a']}), C.$({children: ['b']})]})

    root.render(c)
    // renderTree(c, divs, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('custom inside custom with keys', () => {
    const root = mkRoot()

    let c = C.$({
      children: [C.$({children: ['a'], key: 'a'}), C.$({children: ['b'], key: 'b'})],
    })

    root.render(c)
    // let divs = renderTree(c, null, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    c = C.$({children: [C.$({children: ['a'], key: 'a'})]})

    root.render(c)
    // divs = renderTree(c, divs, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    c = C.$({
      children: [C.$({children: ['a'], key: 'a'}), C.$({children: ['b'], key: 'b'})],
    })

    root.render(c)
    // renderTree(c, divs, root.order, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  // xtest('complex', () => {
  //   const root = mkRoot()
  //
  //   const c = (
  //     <F>
  //       <h1>a</h1>
  //       {pickComponent('a')}
  //     </F>
  //   )
  //
  //   const divs = renderTree(c, null, root, 0)
  //
  //   expect(root.element.innerHTML).toEqual(`<h1>a</h1><div>A</div>`)
  //
  //   const c2 = (
  //     <F>
  //       <h1>a</h1>
  //       {pickComponent('b')}
  //     </F>
  //   )
  //
  //   renderTree(c2, divs, root, 0)
  //
  //   expect(root.element.innerHTML).toEqual(`<h1>a</h1><div>B</div>`)
  // })

  test('different order', () => {
    class Outer extends PureComponent {
      render() {
        return [A.$({}), h1('Heading')]
      }
    }

    const divElement = document.createElement('div')
    render(Outer.$({}), divElement)

    expect(divElement.innerHTML).toEqual(`<div>A</div><h1>Heading</h1>`)
  })
})

class C extends PureComponent {
  render(): FiendNode {
    const {children = []} = this.props

    return div({children})
  }
}

class A extends PureComponent {
  render(): FiendNode | null {
    return div('A')
  }
}
