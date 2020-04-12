import {createTree} from '../lib/create-tree'
import {action, observable} from 'mobx'
import {OComponent} from '../lib/component-types/observer'
import {Tree} from '../lib/component-types/base'

export class TestComponent extends OComponent<{}> {
  @observable
  num = 0

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3>Hello from custom component</h3>
        <button onClick={this.increment}>{`${this.num}`}</button>
        <TestComponent2 num={this.num} />
      </div>
    )
  }

  @action
  increment = () => {
    this.num += 1
  }
}

export class TestComponent2 extends OComponent<{num: number}> {
  render(): Tree | null {
    const {num} = this.props

    return <div>{num.toString()}</div>
  }
}
