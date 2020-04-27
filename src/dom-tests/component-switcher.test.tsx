import {action, observable} from 'mobx'
import {ObserverComponent} from '../lib/component-types/observer-component'
import {createElement} from '../lib/create-element'
import {F} from '../lib/component-types/fragment'
import {render} from '../lib/render'
import {screen} from '@testing-library/dom'
import {Component} from '../lib/component-types/component'
import {Subtree} from '../lib/component-types/base'

describe('component switching', () => {
  it('shows alternate component after state change', () => {
    const store = new Store()

    const s = <Switcher store={store} />
    render(s, document.body)

    expect(screen.queryByText('a')).toBeDefined()
    expect(screen.queryByText('b')).toBeNull()

    store.setA(false)

    console.log(document.body.innerHTML)

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
          <CustomDiv>a</CustomDiv>
        </F>
      )
    }

    return (
      <F>
        <CustomDiv>b</CustomDiv>
      </F>
    )
  }
}

class CustomDiv extends Component {
  render(): Subtree | null {
    const {children} = this.props

    return <div>{children}</div>
  }
}
