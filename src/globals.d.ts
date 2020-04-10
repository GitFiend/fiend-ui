import {Tree, TreeBase, TreeType} from './create-tree'

declare global {
  namespace JSX {
    interface Element extends TreeBase {}

    interface ElementClass extends TreeBase {}
  }
}
