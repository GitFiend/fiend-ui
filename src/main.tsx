import {createTree} from './lib/create-tree'
import {reactMain} from './test/react-compare'
import {test2} from './test/test2'
import {canvasTest} from './test/canvas'
import {boxesTest} from './test/boxes'
import {reactBoxesTest} from './test/boxes-react'

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    // lotsOfElements(root)
    // lotsOfElements(root)
    // lotsOfElements(root)
    // test2(root)
    // canvasTest(root)
    boxesTest()
    // reactBoxesTest()
    // customComponents(root)
  }
}

// function customComponents(root: HTMLElement) {
//   console.time('render')
//
//   render(
//     <div
//       style={{
//         background: 'pink',
//       }}
//       key={'adf'}
//     >
//       <h1>Hello</h1>
//       <TestComponent />
//       {/*<TestComponent />*/}
//       {/*<TestComponent />*/}
//       {/*<TestComponent />*/}
//       {/*<TestComponent />*/}
//     </div>,
//     root
//   )
//
//   console.timeEnd('render')
// }

setTimeout(main, 500)
// setTimeout(reactMain, 540)
