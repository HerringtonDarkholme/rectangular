import Observable from '../observable'
import verifier from '../directives/verifier'
import Directive from '../directives/directive'

export type ChildTag = string | Directive<string> | NodeRep<Node>

export default class NodeRep<T extends Node> extends Observable<any> {
  protected _linkedDirectives: {[a:string]: Directive<{}>} = {}
  public element: T

  constructor(public props: any = {}) {
    super()
    // link directives
    for (let key in props) {
      let obs = verifier.pop(key)
      if (!obs) continue
      obs.value = props[key]
      this._linkedDirectives[key] = obs
      this[obs.name] = obs
    }
  }

  _render(): T {
    throw new Error('Not Implemented')
  }

  remove(): void {
    let element = this.element
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
    let directives= this._linkedDirectives
    for (let dir in directives) {
      directives[dir].unbind(this)
    }
    this.clearCallbacks()
  }
}

export class TextRep extends NodeRep<Text> {
  _render(): Text {
    var node = document.createTextNode(this.value)
    this.onChange(function(_, newVal) {
      node.textContent = newVal
    })
    return this.element = node
  }
}

