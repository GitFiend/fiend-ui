import {OComponent} from '../custom-component'
import {createTree, Tree} from '../create-tree'
import {observable, runInAction} from 'mobx'

export class Mine extends OComponent<{}> {
  @observable
  num = 0

  // constructor(props: {}, children: Tree[]) {
  //   super(props, children)
  //   // console.log('contructor')
  // }

  render() {
    // console.log('render', this.num)

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
      </div>
    )
  }
}
