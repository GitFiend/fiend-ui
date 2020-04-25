import {Custom2} from '../lib/component-types/custom2'
import {createTree} from '../lib/create-tree'
import {render2} from '../lib/render2'
// import {StoreBase} from '../lib/component-types/store'

function randomHue() {
  return Math.round(Math.random() * 1000) % 255
}

// class MyStore extends StoreBase {
//   hue = randomHue()
// }

interface Test2Props {
  // store: MyStore
  children: any
}

export class Test2 extends Custom2<Test2Props> {
  num = 0

  render() {
    // const {store} = this.props

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>
          Num clicks: <NumPane num={this.num} />
        </h3>
        <button onClick={this.onClick} style={{marginRight: 'auto'}}>
          Click Me
        </button>
      </div>
    )
  }

  onClick = () => {
    // this.action(() => {
    //   this.num++
    // })
  }
}

interface NumPaneProps {
  // store: MyStore
  num: number
}

class NumPane extends Custom2<NumPaneProps> {
  render() {
    const hue = Math.round(Math.random() * 1000) % 255

    return (
      <div
        style={{
          fontSize: '18px',
          padding: '10px',
          backgroundColor: `hsl(${hue}, 100%, 80%)`,
        }}
      >
        {this.props.num}
      </div>
    )
  }
}

export function test2(root: HTMLElement) {
  console.time('render')

  // const store = new MyStore()

  render2(
    <div>
      <Test2>OMG1</Test2>
      <Test2>OMG2</Test2>
    </div>,
    root
  )

  console.timeEnd('render')
}
