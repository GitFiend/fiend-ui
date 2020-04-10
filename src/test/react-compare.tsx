import React from 'react'
import {render} from 'react-dom'

const createTree = React.createElement

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
        Some <b>Text</b>
        <div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
        </div>
      </div>,
      root
    )

    console.timeEnd('render')
  }
}
