import {$Component} from '../lib/observables/$component'
import {div} from '../lib/component-types/host/host-components'
import {FiendNode} from '../lib/util/element'
import {PureComponent} from '../lib/component-types/pure-component'

const numElements = 3

export class ScaleElements extends $Component<{position: number}> {
  render() {
    const {position} = this.props

    const elements: FiendNode[] = []

    for (let i = position; i < position + numElements; i++) {
      const text = `element ${i}`

      elements.push(
        Element.$({
          text,
          key: text,
        })
      )
    }

    return div({children: elements})
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

class ElementInner extends PureComponent<{text: string}> {
  render() {
    const {text} = this.props

    return div({
      key: text,
      children: [text],
    })
  }
}
