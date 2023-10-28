import {Div} from '../lib/component-types/host/dom-components'
import {FiendNode} from '../lib/util/element'
import {PureComponent} from '../lib/component-types/pure-component'

const numElements = 3

export class ScaleElements extends PureComponent<{position: number}> {
  render() {
    const {position} = this.props

    const elements: FiendNode[] = []

    for (let i = position; i < position + numElements; i++) {
      const text = `element ${i}`

      elements.push(
        Element.$({
          text,
          key: text,
        }),
      )
    }

    return Div({children: elements})
  }
}

class Element extends PureComponent<{text: string}> {
  render() {
    const {text} = this.props

    return ElementInner.$({
      key: text,
      text,
    })
  }
}

interface Props {
  text: string
}

class ElementInner extends PureComponent<Props> {
  render() {
    const {text} = this.props

    return Div({
      key: text,
      children: [text],
    })
  }
}
