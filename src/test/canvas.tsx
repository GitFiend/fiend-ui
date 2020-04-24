import {Custom2} from '../lib/component-types/custom2'
import {TreeSlice2} from '../lib/component-types/base'
import {createTree} from '../lib/create-tree'
import {createRef} from '../lib/util/ref'
import {render2} from '../lib/render2'

interface TextCanvasProps {
  width: number
  height: number
}

const boxHeight = 30

export class TextCanvas extends Custom2<TextCanvasProps> {
  ref = createRef<HTMLCanvasElement>()

  render(): TreeSlice2 | null {
    const {width, height} = this.props

    return <canvas ref={this.ref} style={{width: width + 'px', height: height + 'px'}} />
  }

  componentDidMount(): void {
    const el = this.ref.current

    if (el) {
      const {width, height} = this.props

      const context = getCanvasContext(el, width, height)

      if (context) this.drawStuff(context, width, height)
    }
  }

  tick = Date.now()

  drawStuff(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const t = ((Date.now() - this.tick) / 6) % boxHeight

    drawBoxes(ctx, width, height, -t)

    requestAnimationFrame(() => {
      this.drawStuff(ctx, width, height)
    })
  }
}

function drawBoxes(ctx: CanvasRenderingContext2D, width: number, height: number, top: number) {
  // console.time('draw boxes')
  ctx.clearRect(0, 0, width, height)
  ctx.beginPath()

  const numBoxes = Math.ceil(height / boxHeight) + 1
  const left = width * 0.2
  const boxWidth = width * 0.6

  for (let i = 0; i < numBoxes; i++) {
    drawBox(ctx, left, top + i * boxHeight, boxWidth, boxHeight)
  }

  ctx.stroke()
  // console.timeEnd('draw boxes')
}

function drawBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.rect(x, y, w, h)

  ctx.font = '13px Arial'
  ctx.fillText('I am a commit message. Here is some text.', x + 5, y + h / 1.5)
}

export function canvasTest(root: HTMLElement) {
  console.time('render')

  render2(<TextCanvas width={window.innerWidth} height={window.innerHeight} />, document.body)

  console.timeEnd('render')
}

export function getCanvasContext(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D | null {
  const scale = window.devicePixelRatio

  canvas.width = width * scale
  canvas.height = height * scale

  const ctx = canvas.getContext('2d')

  if (ctx !== null) ctx.scale(scale, scale)

  return ctx
}
