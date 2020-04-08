import {render} from './render'
import {createTree} from './create-tree'
import {reactMain} from './react-compare'

// let createTree = createTree2

function main(): void {
  const root = document.getElementById('root')

  if (root !== null) {
    console.time('render')

    // const it = <div />

    // render(it, root)
    // render(createTree2('div', {}), root)

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
          </div>
        </div>
      </div>,
      root
    )

    console.timeEnd('render')
  }
}

setTimeout(main, 500)
setTimeout(reactMain, 520)
