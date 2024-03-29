import {PureComponent} from '../lib/component-types/pure-component'
import {render} from '../lib/render'
import {Div} from '../lib/component-types/host/dom-components'
import {s} from '../lib/util/style'
import {FiendElement} from '../lib/util/element'

const boxHeight = 14

interface BoxesProps {
  width: number
  height: number
}

export class Boxes extends PureComponent<BoxesProps> {
  render() {
    const t = ((Date.now() - this.tick) / 20) % boxHeight

    const {width, height} = this.props

    return Div({children: this.drawBoxes(width, height, -t)})
  }

  drawBoxes(width: number, height: number, top: number) {
    const numBoxes = Math.ceil(height / boxHeight) + 1
    const left = width * 0.2
    const boxWidth = width * 0.6

    const boxes: FiendElement[] = Array(numBoxes)

    for (let i = 0; i < numBoxes; i++) {
      boxes[i] = this.drawBox(left, top + i * boxHeight, boxWidth, boxHeight)
    }

    return boxes
  }

  drawBox(x: number, y: number, w: number, h: number): FiendElement {
    return Div({
      style: s`
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${w}px;
          height: ${h}px;
          border: 1px solid;
          display: flex;
          align-items: center;
          padding-left: 5px;
          font-size: 8px;
        `,
      children: [`I am a commit message. Here is some text.`],
    })
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

  render(Boxes.$({width: window.innerWidth, height: window.innerHeight}), document.body)

  console.timeEnd('render')
}
