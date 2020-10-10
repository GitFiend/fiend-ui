import {div} from './component-types/host/host-components'
import {render} from './render'
import {$Component} from './observables/$-component'
import {model} from './observables/make-observable'
import {Component} from './component-types/component'
import {Subtree} from './component-types/base'

class F extends Component {
  render() {
    return this.props.children ?? []
  }
}

function frag(...children: Subtree[]) {
  return F.$({children})
}

describe('render', () => {
  test('repeat render', () => {
    const el = document.createElement('div')

    let t = frag(div('a'), div('b'), div('c'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div>')

    t = frag(div('a'), div('b'), div('c'), div('d'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div><div>d</div>')

    t = frag(div('d'), div('a'), div('b'), div('c'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>d</div><div>a</div><div>b</div><div>c</div>')
  })

  test('update observables', () => {
    @model
    class S {
      $a = true
    }

    class A extends Component {
      render() {
        return div('a')
      }
    }
    class B extends Component {
      render() {
        return div('b')
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
