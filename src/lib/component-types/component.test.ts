import {PureComponent} from './pure-component'
import {Div} from './host/host-components'
import {$Component, makeObservable} from '../..'
import {mkRoot} from '../../dom-tests/test-helpers'
// import {$Model} from '../..'

describe('component', () => {
  test('null in render should remove previous elements', () => {
    class A extends PureComponent<{ok: boolean}> {
      render() {
        const {ok} = this.props

        if (!ok) return null
        return Div('OK')
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
  class M {
    constructor() {
      makeObservable(this)
    }
    $custom = false
  }

  class DivC extends PureComponent {
    render() {
      return Div('custom')
    }
  }

  test('switch to custom from host', () => {
    class A extends $Component<{model: M}> {
      render() {
        const {model} = this.props

        if (model.$custom) {
          return DivC.$({})
        }
        return Div('host')
      }
    }

    const root = mkRoot()
    const model = new M()

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

        return [Div('a'), model.$custom ? DivC.$({}) : Div('host')]
      }
    }

    const root = mkRoot()
    const model = new M()

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

        return [model.$custom ? DivC.$({}) : null, Div('a')]
      }
    }

    const root = mkRoot()
    const model = new M()

    root.render(A.$({model}))
    expect(root.element.innerHTML).toEqual('<div>a</div>')

    model.$custom = true
    expect(root.element.innerHTML).toEqual('<div>custom</div><div>a</div>')

    model.$custom = false
    expect(root.element.innerHTML).toEqual('<div>a</div>')
  })

  // test('scrolling', () => {
  //   class Scroller extends PureComponent<{n: number}> {
  //     render() {
  //       const {n} = this.props
  //
  //       return [
  //         div({children: [n], key: `${n}`}),
  //         div({children: [n + 1], key: `${n + 1}`}),
  //         div({children: [n + 2], key: `${n + 2}`}),
  //       ]
  //     }
  //   }
  //
  //   const root = mkRoot()
  //
  //   root.render(Scroller.$({n: 0}))
  //   expect(root.element.innerHTML).toEqual('<div>0</div><div>1</div><div>2</div>')
  //
  //   root.render(Scroller.$({n: 1}))
  //   expect(root.element.innerHTML).toEqual('<div>1</div><div>2</div><div>3</div>')
  //
  //   root.render(Scroller.$({n: 2}))
  //   expect(root.element.innerHTML).toEqual('<div>2</div><div>3</div><div>4</div>')
  // })
})
