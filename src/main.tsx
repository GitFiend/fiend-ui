import {render} from './lib/render'
import {createTree} from './lib/create-tree'
import {reactMain} from './test/react-compare'
import {TestComponent} from './test/test-component'
import {lotsOfElements} from './test/lots-of-elements'

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    // lotsOfElements(root)
    // lotsOfElements(root)
    lotsOfElements(root)
    // customComponents(root)
  }
}

function customComponents(root: HTMLElement) {
  console.time('render')

  render(
    <div
      style={{
        background: 'pink',
      }}
      key={'adf'}
    >
      <h1>Hello</h1>
      <TestComponent />
      {/*<TestComponent />*/}
      {/*<TestComponent />*/}
      {/*<TestComponent />*/}
      {/*<TestComponent />*/}
    </div>,
    root
  )

  console.timeEnd('render')
}

setTimeout(main, 500)
setTimeout(reactMain, 540)
