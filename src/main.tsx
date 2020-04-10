import {render} from './render'
import {createTree, HostComponent} from './create-tree'
import {reactMain} from './react-compare'
import {CustomComponent} from './custom-component'

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
        Some <b>Text</b>
        <div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
        </div>
      </div>,
      root
    )

    console.timeEnd('render')
  }
}

setTimeout(main, 500)
setTimeout(reactMain, 520)

// class Mine extends CustomComponent<{}> {
//   render(): HostComponent | string | null {
//     return <div>
//
//     </div>
//   }
// }
