import {Custom2} from '../lib/component-types/custom2'
import {createTree} from '../lib/create-tree'
import {TreeSlice2} from '../lib/component-types/base'
import {render2} from '../lib/render2'

const boxHeight = 14

interface BoxesProps {
  width: number
  height: number
}

export class Boxes extends Custom2<BoxesProps> {
  render() {
    const t = ((Date.now() - this.tick) / 20) % boxHeight

    const {width, height} = this.props

    return <div>{this.drawBoxes(width, height, -t)}</div>
  }

  drawBoxes(width: number, height: number, top: number) {
    const numBoxes = Math.ceil(height / boxHeight) + 1
    const left = width * 0.2
    const boxWidth = width * 0.6

    const boxes: TreeSlice2[] = Array(numBoxes)

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

  render2(<Boxes width={window.innerWidth} height={window.innerHeight} />, document.body)

  console.timeEnd('render')
}
