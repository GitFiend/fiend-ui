import {F} from '../lib/component-types/fragment'
import {render} from '../lib/render'
import {screen} from '@testing-library/dom'
import {val} from '../lib/observables/observable'
import {ZComponent} from '../lib/observables/z-component'
import {div} from '../lib/host-components'

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

describe('simple switching with own observer library', () => {
  test('shows alternate div after state update', async () => {
    const store = new Store()

    const s = Switcher.init({store})
    render(s, document.body)

    expect(screen.queryByText('a')).toBeDefined()
    expect(screen.queryByText('b')).toBeNull()

    store.a(false)

    // await sleep(1)

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

    if (store.a()) {
      return F.init(div('a'))
    }

    return F.init(div('b'))
  }
}
