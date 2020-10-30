import {PureComponent} from './pure-component'
import {div} from './host/host-components'
import {mkRoot} from '../../dom-tests/host.test'
import {FiendNode} from '../..'

describe('test re-rendering keyed lists', () => {
  test('plain divs with keys', () => {
    const num = 20

    class Scroller extends PureComponent<{n: number}> {
      render() {
        const {n} = this.props

        const elements: FiendNode[] = []

        for (let i = n; i < num; i++) {
          const s = `${i}`

          elements.push(
            div({
              children: [s],
              key: s,
            })
          )
        }

        return elements
      }
    }

    const result = (n: number): string => {
      let r = ''

      for (let i = n; i < num; i++) {
        r += `<div>${i}</div>`
      }
      return r
    }

    const root = mkRoot()

    let n = 0
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))

    n = 10
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))

    n = 5
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))
  })

  test('divs without keys', () => {
    const num = 3

    class Scroller extends PureComponent<{n: number}> {
      render() {
        const {n} = this.props

        const elements: FiendNode[] = []

        for (let i = n; i < num; i++) {
          const s = `${i}`

          elements.push(
            div({
              children: [s],
            })
          )
        }

        return elements
      }
    }

    const result = (n: number): string => {
      let r = ''

      for (let i = n; i < num; i++) {
        r += `<div>${i}</div>`
      }
      return r
    }

    const root = mkRoot()

    let n = 0
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))

    // Scroll forward
    n = 2
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))

    console.log(result(n))

    // Scroll backward
    n = 1
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))
  })

  test('wrapped divs', () => {
    const num = 20

    class Div extends PureComponent<{text: string}> {
      render() {
        return div(this.props.text)
      }
    }

    class Scroller extends PureComponent<{n: number}> {
      render() {
        const {n} = this.props

        const elements: FiendNode[] = []

        for (let i = n; i < num; i++) {
          const s = `${i}`

          elements.push(
            Div.$({
              text: s,
            })
          )
        }

        return elements
      }
    }

    const result = (n: number): string => {
      let r = ''

      for (let i = n; i < num; i++) {
        r += `<div>${i}</div>`
      }
      return r
    }

    const root = mkRoot()

    let n = 0
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))

    n = 10
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))

    n = 5
    root.render(Scroller.$({n}))
    expect(root.html).toEqual(result(n))
  })
})
