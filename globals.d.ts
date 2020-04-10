import {HostComponent} from './src/create-tree'
import {CustomComponent} from './src/custom-component'

declare global {
  namespace JSX {
    interface Element extends HostComponent {}

    interface ElementClass extends CustomComponent {}
  }
}
