import {render} from '../render'
import {createTree} from '../create-tree'
import {Mine} from './test-component'

export function lotsOfElements(): void {
  const root = document.getElementById('root')

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
        <Mine />
        <Mine />
        Some <b>Text</b>
        <div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
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
              <div>a</div>
              <div>b</div>
              <div>c</div>
              <div>a</div>
              <div>b</div>
              <div>c</div>
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
                  <div>a</div>
                  <div>b</div>
                  <div>c</div>
                  <div>a</div>
                  <div>b</div>
                  <div>c</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      root
    )

    console.timeEnd('render')
  }
}
