import {OComponent} from '../custom-component'
import {createTree, Tree} from '../create-tree'
import {observable, runInAction} from 'mobx'

export class Mine extends OComponent<{}> {
  @observable
  num = 0

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h3>Hello from custom component</h3>
        <button
          onClick={() => {
            // console.log('omg')
            runInAction(() => {
              this.num += 1
              // console.log('new num:', this.num)
            })
            // this.forceUpdate()
          }}
        >
          {`${this.num}`}
        </button>
        <TestComponent2 num={this.num} />
      </div>
    )
  }
}

export class TestComponent2 extends OComponent<{num: number}> {
  render(): Tree | null {
    const {num} = this.props

    return <div>{num.toString()}</div>
  }
}
