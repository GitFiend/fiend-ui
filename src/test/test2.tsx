import {createTree} from '../lib/create-tree'
import {render2} from '../lib/render2'
import {action, observable} from 'mobx'
import {Observer2} from '../lib/component-types/observer2'

function randomHue() {
  return Math.round(Math.random() * 1000) % 255
}

class MyStore {
  @observable
  hue = randomHue()

  @action
  newHue() {
    this.hue = randomHue()
  }
}

interface Test2Props {
  store: MyStore
  children: any
}

export class Test2 extends Observer2<Test2Props> {
  @observable
  num = 0

  render() {
    const {store} = this.props

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>
          Num clicks: <NumPane num={this.num} store={store} />
        </h3>
        <button onClick={this.onClick} style={{marginRight: 'auto'}}>
          Click Me
        </button>
      </div>
    )
  }

  @action
  onClick = () => {
    this.num++
    this.props.store.newHue()
  }
}

interface NumPaneProps {
  store: MyStore
  num: number
}

class NumPane extends Observer2<NumPaneProps> {
  render() {
    return (
      <div
        style={{
          fontSize: '18px',
          padding: '10px',
          backgroundColor: `hsl(${this.props.store.hue}, 100%, 80%)`,
        }}
      >
        {this.props.num}
      </div>
    )
  }
}

export function test2(root: HTMLElement) {
  console.time('render')

  const store = new MyStore()

  render2(
    <div>
      <Test2 store={store}>OMG1</Test2>
      <Test2 store={store}>OMG2</Test2>
    </div>,
    root
  )

  console.timeEnd('render')
}
