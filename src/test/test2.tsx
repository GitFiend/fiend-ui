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
        <NumPane num={this.num} />
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

interface NumPaneProps {
  num: number
}

class NumPane extends Custom2<NumPaneProps> {
  render() {
    const hue = (this.props.num * 10) % 255

    return (
      <div
        style={{
          backgroundColor: `hsl(${hue}, 90%, 80%)`,
        }}
      >
        {this.props.num}
      </div>
    )
  }
}

export function test2(root: HTMLElement) {
  console.time('render')

  render2(
    <div>
      <Test2>OMG1</Test2>
      <Test2>OMG2</Test2>
    </div>,
    root
  )

  console.timeEnd('render')
}
