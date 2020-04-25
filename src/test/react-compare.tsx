import React from 'react'
import {render} from 'react-dom'
import {observable, runInAction} from 'mobx'
import {observer} from 'mobx-react'

const createTree = React.createElement

// @observer
class Mine2 extends React.Component<{}, {num: number}> {
  // @observable
  // num = 0

  state = {
    num: 0
  }

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
            this.setState({
              num: this.state.num + 1
            })
            // console.log('omg')
            // runInAction(() => {
            //   this.num += 1
            //   // console.log('new num:', this.num)
            // })
            // this.forceUpdate()
          }}
        >
          {`${this.state.num}`}
        </button>
      </div>
    )
  }
}

export function reactMain(): void {
  const root = document.getElementById('react-root')

  if (root !== null) {
    console.time('render')

    // @ts-ignore
    render(
      (
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
        </div>
      ) as any,
      root
    )

    console.timeEnd('render')
  }
}
