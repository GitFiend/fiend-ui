import {Component} from './component'
import {time, timeEnd} from '../util/measure'
import {renderSubtrees} from '../render'
import {Subtree, Tree} from './base'

class Fragment extends Component {
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
}

// export const $F = makeCustomComponentConstructor(F)
export const $F = (...args: Subtree[]): Tree => ({
  _type: Fragment as any,
  props: {children: args},
})

// export const $F2 = $$(
//   class extends Component {
//     render() {
//       return this.props.children ?? null
//     }
//   }
// )
