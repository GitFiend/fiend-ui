import {RootComponent} from '../lib/component-types/root-component'

export function mkRoot(): RootComponent {
  return new RootComponent(document.createElement('div'))
}
