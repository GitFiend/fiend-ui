import {PureComponent} from './pure-component'
import {Subtree} from './base'

class Fragment extends PureComponent {
  render() {
    return this.props.children ?? []
  }
}

export function $F(...children: Subtree[]) {
  return Fragment.$({children})
}
