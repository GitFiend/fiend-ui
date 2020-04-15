import {createTree} from '../lib/create-tree'
import {action, observable} from 'mobx'
import {OComponent} from '../lib/component-types/observer'
import {ParentTree, Tree} from '../lib/component-types/base'
import {Component} from '../lib/component-types/custom'

export class TestComponent extends Component<{}> {
  // @observable
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
        <TestComponent2 num={this.num} o={{moreNum: 100}} />
      </div>
    )
  }

  // @action
  increment = () => {
    this.action(() => {
      this.num += 1
    })
  }
}

interface TC2Props {
  num: number
  o: {moreNum: number}
}

interface TC2State {
  moreNum: number
}

export class TestComponent2 extends Component<TC2Props, TC2State> {
  render(): ParentTree | null {
    const {num} = this.props
    const {moreNum} = this.derived

    return (
      <div>
        {num.toString()}, {moreNum.toString()}
      </div>
    )
  }

  // get state(): TC2ExtraState {
  //   return {
  //     moreNum: this.props.o.moreNum,
  //   }
  // }

  calcDerived(props: TC2Props): TC2State {
    return {
      moreNum: props.o.moreNum,
    }
  }
}

// function action2(target: any, key: any, ...args: any[]): any {
//   const f = target[key]
//
//   target[key] = target.action(() => {
//     f()
//   })
//   // target[key]
//   // target.action(target[key])
//   console.log(args)
// }
