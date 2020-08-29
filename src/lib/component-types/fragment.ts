import {Component, makeCustomComponentConstructor} from './component'
import {time, timeEnd} from '../util/measure'
import {renderSubtree} from '../render'

export class F extends Component {
  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }

    this.subComponents = renderSubtree(
      this.props.children ?? [],
      this.subComponents,
      this
    )

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }
}

export const $F = makeCustomComponentConstructor(F)

// export const $F2 = $$(
//   class extends Component {
//     render() {
//       return this.props.children ?? null
//     }
//   }
// )
