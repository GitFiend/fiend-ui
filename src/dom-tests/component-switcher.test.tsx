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

    store.setA(true)
    // console.log(document.body.innerHTML)
    expect(screen.queryByText('a')).toBeDefined()
    expect(screen.queryByText('b')).toBeNull()

    store.setA(false)
    // console.log(document.body.innerHTML)
    expect(screen.queryByText('b')).toBeDefined()
    expect(screen.queryByText('a')).toBeNull()

    // TODO: Broken!
    store.setA(true)
    // console.log(document.body.innerHTML)
    // expect(screen.queryByText('a')).toBeDefined()
    // expect(screen.queryByText('b')).toBeNull()
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
    return (
      <div>
        <h1>Heading</h1>
        {this.drawSwitchingPart()}
        <footer>Footer</footer>
      </div>
    )
  }

  drawSwitchingPart() {
    const {store} = this.props

    if (store.a) {
      // console.log('a')
      return (
        <F>
          <CustomDiv>a</CustomDiv>
        </F>
      )
    }

    // console.log('b')
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
