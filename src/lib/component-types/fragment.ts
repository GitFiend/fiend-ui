import {Component} from './component'
import {time, timeEnd} from '../util/measure'
import {renderSubtrees} from '../render'
import {AnyComponent, ComponentType, Subtree, Tree} from './base'

// TODO: Maybe this shouldn't extend Component.
class Fragment extends Component {
  subComponents = new Map<string, AnyComponent>()

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }

    this.subComponents = renderSubtrees(
      this.props.children ?? [],
      this.subComponents,
      this.order
    )

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }

  // TODO: Is this returning elements in the correct order?
  get elements(): (Element | Text)[] {
    const elements: (Element | Text)[] = []

    for (const [, c] of this.subComponents) {
      switch (c._type) {
        case ComponentType.host:
        case ComponentType.text:
          elements.push(c.element)
          break
        case ComponentType.custom:
          elements.push(...c.elements)
          break
      }
    }

    return elements
  }

  remove() {
    super.remove()

    this.subComponents.forEach(c => c.remove())
  }
}

export const $F = (...args: Subtree[]): Tree => ({
  _type: Fragment as any,
  props: {children: args},
})
