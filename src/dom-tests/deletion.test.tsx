import {Component} from '../lib/component-types/component'
import {Subtree} from '../lib/component-types/base'
import {createElement} from '../lib/create-element'
import {mkRoot} from './host.test'
import {renderTree} from '../lib/render'
import {F} from '../lib/component-types/fragment'

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

    const divs2 = renderTree(c2, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    const c3 = (
      <C>
        <div>a</div>
        <div>b</div>
      </C>
    )

    renderTree(c3, divs2, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('custom inside custom', () => {
    const root = mkRoot()

    let c = (
      <C>
        <C>a</C>
        <C>b</C>
      </C>
    )

    let divs = renderTree(c, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)

    c = (
      <C>
        <C>a</C>
      </C>
    )

    divs = renderTree(c, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div></div>`)

    c = (
      <C>
        <C>a</C>
        <C>b</C>
      </C>
    )

    divs = renderTree(c, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<div><div>a</div><div>b</div></div>`)
  })

  test('complex', () => {
    const root = mkRoot()

    const c = (
      <F>
        <h1>a</h1>
        {pickComponent('a')}
      </F>
    )

    const divs = renderTree(c, null, root, 0)

    expect(root.element.innerHTML).toEqual(`<h1>a</h1><div>A</div>`)

    const c2 = (
      <F>
        <h1>a</h1>
        {pickComponent('b')}
      </F>
    )

    renderTree(c2, divs, root, 0)

    expect(root.element.innerHTML).toEqual(`<h1>a</h1><div>B</div>`)
  })
})

class C extends Component {
  render(): Subtree | null {
    const {children} = this.props

    return <div>{children}</div>
  }
}

function pickComponent(component: 'a' | 'b') {
  if (component === 'a') {
    return <A />
  }
  return <B />
}

class A extends Component {
  render(): Subtree | null {
    return <div>A</div>
  }
}

class B extends Component {
  render(): Subtree | null {
    return <div>B</div>
  }
}
