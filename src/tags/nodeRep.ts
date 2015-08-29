import {Var, Obs} from '../overkill/index'
import verifier from '../directives/verifier'
import Directive from '../directives/directive'

export type ChildTag = string | Var<string> | NodeRep<Node>

abstract class NodeRep<T extends Node> {
  protected _linkedDirectives: {[a:string]: Directive<{}>} = {}
  public element: T

  constructor(public props: any = {}) {
    // link directives
    for (let key in props) {
      let obs = verifier.pop(key)
      if (!obs) continue
      this._linkedDirectives[key] = obs
      this[obs.name] = obs.v
    }
  }

  abstract _render(): T

  remove(): void {
    let element = this.element
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
    let directives= this._linkedDirectives
    for (let dir in directives) {
      directives[dir].unbind(this)
    }
  }
}

export default NodeRep

export class TextRep extends NodeRep<Text> {
  constructor(public props: Var<string>) {
    super(props)
  }
  _render(): Text {
    let obs = this.props
    var node = document.createTextNode(obs())
    Obs<string, {}>(obs, (n) => {
      node.textContent =  n
    })
    return this.element = node
  }
}

