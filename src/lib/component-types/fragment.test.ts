import {$F} from './fragment'
import {div} from './host/host-components'
import {mkRoot} from '../../dom-tests/host.test'
import {$Component} from '../observables/$-component'

describe('fragment', () => {
  test('one host child', () => {
    const root = mkRoot()

    const t = $F(div('omg'))

    root.render(t)

    expect(root.element.innerHTML).toEqual('<div>omg</div>')
  })

  test('custom component child', () => {
    class C extends $Component {
      render() {
        return div('omg')
      }
    }

    const root = mkRoot()
    root.render(C.$({}))

    expect(root.element.innerHTML).toEqual('<div>omg</div>')
  })

  test('multiple children', () => {
    const root = mkRoot()

    let t = $F(div('a'), div('b'), div('c'))

    root.render(t)

    expect(root.element.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div>')

    t = $F(div('a'), div('b'), div('c'), div('d'))

    root.render(t)

    expect(root.element.innerHTML).toEqual(
      '<div>a</div><div>b</div><div>c</div><div>d</div>'
    )

    t = $F(div('d'), div('a'), div('b'), div('c'))

    root.render(t)

    expect(root.element.innerHTML).toEqual(
      '<div>d</div><div>a</div><div>b</div><div>c</div>'
    )
  })
})
