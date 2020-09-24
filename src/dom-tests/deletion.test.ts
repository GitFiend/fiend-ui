import {Component} from '../lib/component-types/component'
import {Subtree} from '../lib/component-types/base'
import {mkRoot} from './host.test'
import {render, renderTree} from '../lib/render'
import {$F} from '../lib/component-types/fragment'
import {div, h1} from '../lib/host-components'

describe('deletion of custom component', () => {
  test('host inside custom', () => {
    const root = mkRoot()

    const c = C.$({children: [div('a'), div('b')]})

    const divs = renderTree(c, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    const c2 = C.$({children: [div('a')]})

    const divs2 = renderTree(c2, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    const c3 = C.$({children: [div('a'), div('b')]})

    renderTree(c3, divs2, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('custom inside custom', () => {
    const root = mkRoot()

    let c = C.$({children: [C.$({children: ['a']}), C.$({children: ['b']})]})

    let divs = renderTree(c, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    c = C.$({children: [C.$({children: ['a']})]})

    divs = renderTree(c, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    c = C.$({children: [C.$({children: ['a']}), C.$({children: ['b']})]})

    renderTree(c, divs, root, 0)

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
    class Outer extends Component {
      render(): Subtree | null {
        return $F(A.$({}), h1('Heading'))
      }
    }

    const divElement = document.createElement('div')
    render(Outer.$({}), divElement)

    expect(divElement.innerHTML).toEqual(`<div>A</div><h1>Heading</h1>`)
  })
})

class C extends Component {
  render(): Subtree {
    const {children = []} = this.props

    return div({children})
  }
}

class A extends Component {
  render(): Subtree | null {
    return div('A')
  }
}
