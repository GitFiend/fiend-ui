import {HostComponent} from './src/create-tree'
import {ZComponent} from './src/custom-component'

declare global {
  namespace JSX {
    interface Element extends HostComponent {}

    interface ElementClass extends ZComponent<any> {}
  }
}
