import {render} from './lib/render'
import {createTree} from './lib/create-tree'
import {reactMain} from './test/react-compare'
import {TestComponent} from './test/test-component'

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    console.time('render')

    render(
      <div
        style={{
          background: 'pink'
        }}
        key={'adf'}
      >
        <h1>Hello</h1>
        <TestComponent />
        <TestComponent />
        <TestComponent />
        <TestComponent />
        <TestComponent />
      </div>,
      root
    )

    console.timeEnd('render')
  }
}

setTimeout(main, 500)
setTimeout(reactMain, 520)
