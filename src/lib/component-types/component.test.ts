import {PureComponent} from './pure-component'
import {mkRoot} from '../../dom-tests/host.test'
import {div} from './host/host-components'
import {$Component} from '../..'
import {$Model} from '../..'

describe('component', () => {
  test('null in render should remove previous elements', () => {
    class A extends PureComponent<{ok: boolean}> {
      render() {
        const {ok} = this.props

        if (!ok) return null
        return div('OK')
      }
    }

    const root = mkRoot()

    root.render(A.$({ok: true}))

    expect(root.element.innerHTML).toEqual(`<div>OK</div>`)

    root.render(A.$({ok: false}))

    expect(root.element.innerHTML).toEqual(``)
  })
})

describe('switch between custom and host component', () => {
  class M extends $Model {
    $custom = false
  }

  class Div extends PureComponent {
    render() {
      return div('custom')
    }
  }

  test('switch to custom from host', () => {
    class A extends $Component<{model: M}> {
      render() {
        const {model} = this.props

        if (model.$custom) {
          return Div.$({})
        }
        return div('host')
      }
    }

    const root = mkRoot()
    const model = M.$()

    root.render(A.$({model}))
    expect(root.element.innerHTML).toEqual('<div>host</div>')

    model.$custom = true
    expect(root.element.innerHTML).toEqual('<div>custom</div>')

    model.$custom = false
    expect(root.element.innerHTML).toEqual('<div>host</div>')
  })

  test('switch one inside array', () => {
    class A extends $Component<{model: M}> {
      render() {
        const {model} = this.props

        return [div('a'), model.$custom ? Div.$({}) : div('host')]
      }
    }

    const root = mkRoot()
    const model = M.$()

    root.render(A.$({model}))
    expect(root.element.innerHTML).toEqual('<div>a</div><div>host</div>')

    model.$custom = true
    expect(root.element.innerHTML).toEqual('<div>a</div><div>custom</div>')

    model.$custom = false
    expect(root.element.innerHTML).toEqual('<div>a</div><div>host</div>')
  })

  test('switch one to null', () => {
    class A extends $Component<{model: M}> {
      render() {
        const {model} = this.props

        return [model.$custom ? Div.$({}) : null, div('a')]
      }
    }

    const root = mkRoot()
    const model = M.$()

    root.render(A.$({model}))
    expect(root.element.innerHTML).toEqual('<div>a</div>')

    model.$custom = true
    expect(root.element.innerHTML).toEqual('<div>custom</div><div>a</div>')

    model.$custom = false
    expect(root.element.innerHTML).toEqual('<div>a</div>')
  })
})
