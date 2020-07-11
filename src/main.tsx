import {createElement} from './lib/create-element'

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    // lotsOfElements(root)
    // lotsOfElements(root)
    // lotsOfElements(root)
    // test2(root)
    // test2React(root)
    // canvasTest(root)
    // boxesTest()
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
