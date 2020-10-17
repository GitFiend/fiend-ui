import {PureComponent} from './pure-component'
import {FiendNode} from '../util/element'

class Fragment extends PureComponent {
  render() {
    return this.props.children ?? []
  }
}

export function $F(...children: FiendNode[]) {
  return Fragment.$({children})
}
