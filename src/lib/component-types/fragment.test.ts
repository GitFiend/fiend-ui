import {$F} from './fragment'
import {Div} from './host/dom-components'
import {$Component} from '../..'
import {makeObservable} from '../..'
import {mkRoot} from '../../dom-tests/test-helpers'

describe('fragment', () => {
  test('one host child', () => {
    const root = mkRoot()

    const t = $F(Div('omg'))

    root.render(t)

    expect(root.element.innerHTML).toEqual('<div>omg</div>')
  })

  test('custom component child', () => {
    class C extends $Component {
      render() {
        return Div('omg')
      }
    }

    const root = mkRoot()
    root.render(C.$({}))

    expect(root.element.innerHTML).toEqual('<div>omg</div>')
  })

  test('multiple children', () => {
    const root = mkRoot()

    let t = $F(Div('a'), Div('b'), Div('c'))

    root.render(t)

    expect(root.element.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div>')

    t = $F(Div('a'), Div('b'), Div('c'), Div('d'))

    root.render(t)

    expect(root.element.innerHTML).toEqual(
      '<div>a</div><div>b</div><div>c</div><div>d</div>',
    )

    t = $F(Div('d'), Div('a'), Div('b'), Div('c'))

    root.render(t)

    expect(root.element.innerHTML).toEqual(
      '<div>d</div><div>a</div><div>b</div><div>c</div>',
    )
  })

  test('custom component with fragment', () => {
    class S {
      $text = 'text1'

      constructor() {
        makeObservable(this)
      }
    }

    class C extends $Component<{store: S}> {
      render() {
        return Div({children: [this.props.store.$text], key: 'container'})
      }
    }
    const root = mkRoot()

    const s = new S()

    root.render(C.$({store: s}))
    expect(root.element.innerHTML).toEqual('<div>text1</div>')

    s.$text = 'text2'
    expect(root.element.innerHTML).toEqual('<div>text2</div>')

    s.$text = 'text3'
    expect(root.element.innerHTML).toEqual('<div>text3</div>')
  })
})
