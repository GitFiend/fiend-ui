import {PureComponent} from '..'
import {render} from '..'
import {Div, H1} from '..'
import {FiendNode} from '..'
import {mkRoot} from './test-helpers'

describe('deletion of custom component', () => {
  test('host inside host', () => {
    const root = mkRoot()

    const c = Div({children: [Div('a'), Div('b')]})

    root.render(c)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = Div({children: [Div('a')]})

    root.render(c2)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    const c3 = Div({children: [Div('a'), Div('b')]})

    root.render(c3)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('host inside custom', () => {
    const root = mkRoot()

    const c = C.$({children: [Div('a'), Div('b')]})

    root.render(c)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = C.$({children: [Div('a')]})

    root.render(c2)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    const c3 = C.$({children: [Div('a'), Div('b')]})

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
        return [A.$({}), H1('Heading')]
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

    return Div({children})
  }
}

class A extends PureComponent {
  render(): FiendNode | null {
    return Div('A')
  }
}
