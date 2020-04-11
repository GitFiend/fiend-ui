import React from 'react'
import {render} from 'react-dom'
import {observable, runInAction} from 'mobx'
import {observer} from 'mobx-react'

const createTree = React.createElement

@observer
class Mine2 extends React.Component<{}> {
  @observable
  num = 0

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

export function reactMain(): void {
  const root = document.getElementById('react-root')

  if (root !== null) {
    console.time('render')

    render(
      <div
        style={{
          background: 'pink'
        }}
        key={'adf'}
      >
        <h1>Hello</h1>
        {/*<Mine2 />*/}
        {/*<Mine2 />*/}
        {/*<Mine2 />*/}
        {/*<Mine2 />*/}
        {/*<Mine2 />*/}
      </div>,
      root
    )

    console.timeEnd('render')
  }
}
