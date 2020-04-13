import {HostComponent} from './src/lib/component-types/host'
import {Component} from './src/lib/component-types/custom'

declare global {
  namespace JSX {
    interface Element extends HostComponent {}

    interface ElementClass extends Component<any> {}
  }
}
