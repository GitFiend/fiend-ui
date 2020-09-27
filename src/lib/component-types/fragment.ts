import {Component} from './component'
import {time, timeEnd} from '../util/measure'
import {renderSubtrees} from '../render'
import {AnyComponent, Subtree, Tree} from './base'

class Fragment extends Component {
  subComponents = new Map<string, AnyComponent>()

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }

    this.subComponents = renderSubtrees(
      this.props.children ?? [],
      this.subComponents,
      this
    )

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
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
