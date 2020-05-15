import {createElement} from '../lib/create-element'
import {F} from '../lib/component-types/fragment'
import {render} from '../lib/render'
import {screen} from '@testing-library/dom'
import {val} from '../lib/observables/observable'
import {ZComponent} from '../lib/observables/z-component'

describe('simple switching with own observer library', () => {
  xit('shows alternate div after state update', () => {
    const store = new Store()

    const s = <Switcher store={store} />
    render(s, document.body)

    expect(screen.queryByText('a')).toBeDefined()
    expect(screen.queryByText('b')).toBeNull()

    store.a(false)

    expect(screen.queryByText('b')).toBeDefined()
    expect(screen.queryByText('a')).toBeNull()
  })
})

class Store {
  a = val(true)
}

interface SwitcherProps {
  store: Store
}
class Switcher extends ZComponent<SwitcherProps> {
  render() {
    const {store} = this.props
    console.log('render switcher', store.a())

    if (store.a()) {
      return (
        <F>
          <div>a</div>
        </F>
      )
    }

    return (
      <F>
        <div>b</div>
      </F>
    )
  }
}
