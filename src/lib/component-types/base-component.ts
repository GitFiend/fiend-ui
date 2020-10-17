import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {PureComponent} from './pure-component'

export type AnyComponent = HostComponent | TextComponent | PureComponent

export enum ComponentType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  _type: ComponentType
  parent: unknown
  order: string

  // Remove the component and run cleanup. Not necessarily related to element removal.
  remove(): void
}
