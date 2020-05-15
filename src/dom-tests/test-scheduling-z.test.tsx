import {createElement} from '../lib/create-element'
import {F} from '../lib/component-types/fragment'
import {render} from '../lib/render'
import {screen} from '@testing-library/dom'
import {val} from '../lib/observables/observable'
import {ZComponent} from '../lib/observables/z-component'

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

xdescribe('test scheduling', () => {
  test('shows alternate div after state update', () => {
    const store = new Store()

    const s = <A store={store} />
    render(s, document.body)

    console.log(document.body.innerHTML)

    expect(screen.queryByText('a')).toBeDefined()
    expect(screen.queryByText('b')).toBeNull()

    // store.a(false)

    // await sleep(1)

    expect(screen.queryByText('b')).toBeDefined()
    expect(screen.queryByText('a')).toBeNull()
  })
})

class Store {
  a = val(2)
  b = val(3)
  c = val(4)
}

interface SwitcherProps {
  store: Store
}
class A extends ZComponent<SwitcherProps> {
  render() {
    const {store} = this.props

    return (
      <F>
        <div>{store.a()}</div>
        <B store={store} />
      </F>
    )
  }
}
class B extends ZComponent<SwitcherProps> {
  render() {
    const {store} = this.props

    return <div>{store.b()}</div>
    // return (
    //   <F>
    //     <div>{store.b()}</div>
    //     {/*<C store={store} />*/}
    //   </F>
    // )
  }
}
class C extends ZComponent<SwitcherProps> {
  render() {
    const {store} = this.props

    return (
      <F>
        <div>{store.c()}</div>
      </F>
    )
  }
}
