import {F} from '../lib/component-types/fragment'
import {render} from '../lib/render'
import {screen} from '@testing-library/dom'
import {$Val} from '../lib/observables/observable'
import {$Component} from '../lib/observables/$-component'
import {div} from '../lib/host-components'
import {$} from '../lib/component-types/component'

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

    const s = $(Switcher, {store})
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
  a = $Val(true)
}

interface SwitcherProps {
  store: Store
}

class Switcher extends $Component<SwitcherProps> {
  render() {
    const {store} = this.props

    if (store.a()) {
      return $(F, div('a'))
    }

    return $(F, div('b'))
  }
}
