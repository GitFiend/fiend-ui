// @ts-nocheck

import React from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {render} from 'react-dom'

const createTree = React.createElement

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

@observer
export class Test2 extends React.Component<Test2Props> {
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

@observer
class NumPane extends React.Component<NumPaneProps> {
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

@observer
class Nested extends React.Component<{}> {
  @observable num = 100

  render() {
    return <button onClick={this.onClick}>{this.num}</button>
  }

  @action
  onClick = () => {
    this.num--
  }
}

export function test2React(root: HTMLElement) {
  console.time('render')

  const store = new MyStore()

  // @ts-ignore
  render(
    <div>
      <Test2 store={store}>OMG1</Test2>
      <Test2 store={store}>OMG2</Test2>
    </div>,
    root
  )

  console.timeEnd('render')
}
