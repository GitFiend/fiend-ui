import {action, observable} from 'mobx'
import {ObserverComponent} from '../lib/component-types/observer-component'
import {createElement} from '../lib/create-element'
import {F} from '../lib/component-types/fragment'
import {render} from '../lib/render'
import {screen} from '@testing-library/dom'

describe('simple switching', () => {
  it('shows alternate div after state update', () => {
    const store = new Store()

    const s = <Switcher store={store} />
    render(s, document.body)

    // console.log(document.body.innerHTML)

    expect(screen.queryByText('a')).toBeDefined()
    expect(screen.queryByText('b')).toBeNull()

    store.setA(false)

    expect(screen.queryByText('b')).toBeDefined()
    expect(screen.queryByText('a')).toBeNull()
  })
})

class Store {
  @observable
  a = true

  @action
  setA(a: boolean) {
    this.a = a
  }
}

interface SwitcherProps {
  store: Store
}
class Switcher extends ObserverComponent<SwitcherProps> {
  render() {
    const {store} = this.props

    if (store.a) {
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
