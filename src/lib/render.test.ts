import {Div} from './component-types/host/host-components'
import {render} from './render'
import {$Component} from './observables/$component'
import {model} from './observables/$model'
import {PureComponent} from './component-types/pure-component'
import {FiendNode} from './util/element'

class F extends PureComponent {
  render() {
    return this.props.children ?? []
  }
}

function frag(...children: FiendNode[]) {
  return F.$({children})
}

describe('render', () => {
  test('repeat render', () => {
    const el = document.createElement('div')

    let t = frag(Div('a'), Div('b'), Div('c'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div>')

    t = frag(Div('a'), Div('b'), Div('c'), Div('d'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div><div>d</div>')

    t = frag(Div('d'), Div('a'), Div('b'), Div('c'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>d</div><div>a</div><div>b</div><div>c</div>')
  })

  test('update observables', () => {
    @model
    class S {
      $a = true
    }

    class A extends PureComponent {
      render() {
        return Div('a')
      }
    }
    class B extends PureComponent {
      render() {
        return Div('b')
      }
    }

    class C extends $Component<{store: S}> {
      render() {
        if (this.props.store.$a) return A.$({})
        return B.$({})
      }
    }

    const el = document.createElement('div')

    const s = new S()
    render(C.$({store: s}), el)
    expect(el.innerHTML).toEqual('<div>a</div>')

    s.$a = false
    expect(el.innerHTML).toEqual('<div>b</div>')
  })
})
