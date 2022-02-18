import {render} from '..'
import {screen} from '@testing-library/dom'
import {$Val} from '../lib/observables/atom'
import {$Component} from '..'
import {Div} from '..'

export function sleep(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

// TODO: This test needs to be rewritten.

xdescribe('test scheduling', () => {
  test('shows alternate div after state update', () => {
    const store = new Store()

    // const s = <A store={store} />
    const s = A.$({store})
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
  a = $Val(2)
  b = $Val(3)
  c = $Val(4)
}

interface SwitcherProps {
  store: Store
}
class A extends $Component<SwitcherProps> {
  render() {
    const {store} = this.props

    return [Div(store.a().toString()), B.$({store})]

    // return (
    //   <F>
    //     <div>{store.a()}</div>
    //     <B store={store} />
    //   </F>
    // )
  }
}
class B extends $Component<SwitcherProps> {
  render() {
    const {store} = this.props

    return Div(store.b().toString())
  }
}
class C extends $Component<SwitcherProps> {
  render() {
    const {store} = this.props

    return Div(store.c().toString())
  }
}
