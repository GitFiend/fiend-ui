import {PureComponent} from './pure-component'
import {div} from './host/host-components'
import {FiendNode} from '../..'
import {mkRoot} from '../../dom-tests/test-helpers'

describe('test re-rendering keyed lists', () => {
  test('plain divs with keys', () => {
    const num = 20

    class Scroller extends PureComponent<{n: number}> {
      render() {
        const {n} = this.props

        const elements: FiendNode[] = []

        for (let i = 0; i < num; i++) {
          const s = `${n + i}`

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

    const root = mkRoot()

    let n = 0
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    n = 10
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    n = 5
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))
  })

  test('divs without keys', () => {
    const num = 4

    class Scroller extends PureComponent<{n: number}> {
      render() {
        const {n} = this.props

        const elements: FiendNode[] = []

        for (let i = 0; i < num; i++) {
          const s = `${n + i}`

          elements.push(
            div({
              children: [s],
            })
          )
        }

        return elements
      }
    }

    const root = mkRoot()

    let n = 0
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    // Scroll forward
    n = 6
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    console.log(result(n, num))

    // Scroll backward
    n = 5
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    // Scroll backward
    n = 4
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    // Scroll backward
    n = 3
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))
  })

  test('wrapped divs', () => {
    const num = 3

    class Div extends PureComponent<{text: string}> {
      render() {
        return div({children: [this.props.text]})
      }
    }

    class Scroller extends PureComponent<{n: number}> {
      render() {
        const {n} = this.props

        const elements: FiendNode[] = []

        for (let i = 0; i < num; i++) {
          const s = `${n + i}`

          elements.push(
            Div.$({
              text: s,
              key: s,
            })
          )
        }

        return elements
      }
    }

    const root = mkRoot()

    let n = 0
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    n = 9
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))

    n = 8
    root.render(Scroller.$({n}))
    expect(root.inserted.length).toEqual(num)
    expect(root.html).toEqual(result(n, num))
  })
})

const result = (index: number, numDivs: number): string => {
  let r = ''

  for (let i = 0; i < numDivs; i++) {
    r += `<div>${index + i}</div>`
  }
  return r
}
