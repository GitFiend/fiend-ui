import {ParentTree2, TreeBase, TreeType} from './base'

export class Text2 implements TreeBase {
  type = TreeType.text as const
  element: Text

  constructor(public text: string, public parent: ParentTree2) {
    this.element = document.createTextNode(text)
    parent.element.appendChild(this.element)
  }

  remove(): void {
    this.element.remove()
  }
}
