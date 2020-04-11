import {render} from '../lib/render'
import {createTree} from '../lib/create-tree'
import {TestComponent} from './test-component'

export function lotsOfElements(root: HTMLElement): void {
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
