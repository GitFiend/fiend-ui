import {Component} from '../lib/component-types/component'
import {createElement} from '../lib/create-element'
import {JSXSlice} from '../lib/component-types/base'
import {render} from '../lib/render'

const boxHeight = 14

interface BoxesProps {
  width: number
  height: number
}

export class Boxes extends Component<BoxesProps> {
  render() {
    const t = ((Date.now() - this.tick) / 20) % boxHeight

    const {width, height} = this.props

    return <div>{this.drawBoxes(width, height, -t)}</div>
  }

  drawBoxes(width: number, height: number, top: number) {
    const numBoxes = Math.ceil(height / boxHeight) + 1
    const left = width * 0.2
    const boxWidth = width * 0.6

    const boxes: JSXSlice[] = Array(numBoxes)

    for (let i = 0; i < numBoxes; i++) {
      boxes[i] = this.drawBox(left, top + i * boxHeight, boxWidth, boxHeight)
    }

    return boxes
  }

  drawBox(x: number, y: number, w: number, h: number) {
    return (
      <div
        style={{
          position: 'absolute',
          left: x + 'px',
          top: y + 'px',
          width: w + 'px',
          height: h + 'px',
          border: '1px solid',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '5px',
          fontSize: '8px',
        }}
      >
        I am a commit message. Here is some text.
      </div>
    )
  }

  componentDidMount(): void {
    const {width, height} = this.props

    this.loopBoxes(width, height)
  }

  tick = Date.now()

  loopBoxes(width: number, height: number) {
    this.update()

    requestAnimationFrame(() => {
      this.loopBoxes(width, height)
    })
  }
}

export function boxesTest() {
  console.time('render')

  render(<Boxes width={window.innerWidth} height={window.innerHeight} />, document.body)

  console.timeEnd('render')
}
