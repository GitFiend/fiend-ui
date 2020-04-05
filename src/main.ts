import {render} from './render'
import {div, text} from './create-tree'

import {myNodes} from './test-tsx'

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    console.time('render')

    console.log(myNodes)

    // render(
    //   div(
    //     {
    //       id: 'div1',
    //       style: {}
    //     },
    //     [
    //       div(
    //         {
    //           id: 'div2',
    //           style: {}
    //         },
    //         []
    //       ),
    //       text('omg'),
    //       new MyCustomComponent({}, [], 'yep')
    //     ]
    //   ),
    //   root
    // )
    render(myNodes, root)

    console.timeEnd('render')
  }
}

main()
