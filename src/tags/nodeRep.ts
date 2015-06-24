import Observable from '../observable'
import verifier from '../directives/verifier'
import Directive from '../directives/directive'

export type ChildTag = string | Directive<string> | NodeRep<Node>

export default class NodeRep<T extends Node> extends Observable<any> {
  protected _linkedDirectives: {[a:string]: Directive<{}>} = {}
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
}

export class TextRep extends NodeRep<Text> {
  _render(): Text {
    var node = document.createTextNode(this.value)
    this.onChange(function(_, newVal) {
      node.textContent = newVal
    })
    return node
  }
}

