import {createElement} from '../lib/create-element'
import {render} from '../lib/render'
import {action, observable} from 'mobx'
import {ObserverComponent} from '../lib/component-types/observer-component'
import {F} from '../lib/component-types/fragment'
import {val} from "../lib/observables/observable";

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

const object = val([1, 2, 3])

const a = [...object()]

a[0] = 4

object(a)

interface Test2Props {
  store: MyStore
}

export class Test2 extends ObserverComponent<Test2Props> {
  @observable
  num = 0

  render() {
    const {store, children} = this.props

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>
          Num clicks: <NumPane num={this.num} store={store} />
        </h3>
        {children}
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

class NumPane extends ObserverComponent<NumPaneProps> {
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
        <Nested />
      </div>
    )
  }
}

class Nested extends ObserverComponent {
  @observable num = 100

  render() {
    return (
      <F>
        <p>n:</p>
        <button onClick={this.onClick}>{this.num}</button>
      </F>
    )
  }

  @action
  onClick = () => {
    this.num--
  }
}

export function test2(root: HTMLElement) {
  console.time('render')

  const store = new MyStore()

  render(
    <div>
      <Test2 store={store}>OMG1</Test2>
      <Test2 store={store}>OMG2</Test2>
    </div>,
    root
  )

  console.timeEnd('render')
}
