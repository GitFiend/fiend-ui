import {Component} from './component'

export class F extends Component {
  render() {
    return this.props.children ?? null
  }
}
