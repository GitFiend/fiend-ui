import {Custom2} from '../lib/component-types/custom2'
import {createTree} from '../lib/create-tree'
import {render2} from '../lib/render2'

interface Test2Props {}

export class Test2 extends Custom2<Test2Props> {
  num = 0

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>{`Num clicks: ${this.num}`}</h3>
        <button
          onClick={() => {
            this.action(() => {
              this.num++
            })
          }}
        >
          Click Me
        </button>
      </div>
    )
  }
}

export function test2(root: HTMLElement) {
  console.time('render')

  render2(<Test2>OMG1</Test2>, root)

  console.timeEnd('render')
}
