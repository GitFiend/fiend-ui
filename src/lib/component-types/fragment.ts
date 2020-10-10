import {Component} from './component'
import {Subtree} from './base'

class Fragment extends Component {
  render() {
    return this.props.children ?? []
  }
}

export function $F(...children: Subtree[]) {
  return Fragment.$({children})
}
