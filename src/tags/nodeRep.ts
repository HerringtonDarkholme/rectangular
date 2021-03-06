import {Var, Obs} from '../overkill/index'
import verifier from '../directives/verifier'
import Directive from '../directives/directive'
import EventEmitter from '../eventEmitter'
import {normalizeChildTag} from './util'

export type ChildTag = string | Var<string> | NodeRep<Node>
export type Child<T> = string | Var<string> | T

abstract class NodeRep<T extends Node> extends EventEmitter {
  protected _linkedDirectives: {[a:string]: Directive<{}>} = {}
  protected $directives: Directive<{}>[] = []
  public element: T

  constructor(public props: any = {}) {
    super()
    // link directives
    for (let key in props) {
      let obs = verifier.pop(key)
      if (!obs) continue
      this._linkedDirectives[key] = obs
      this[obs.name] = obs.v
    }
  }

  abstract _render(): T

  _remove(): void {
    let element = this.element
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
    let directives= this.$directives
    for (let dir of directives) {
      dir.unbind(this)
    }
  }

  addRefBefore(t: NodeRep<Node>) {
    let childNode = t._render()
    this.element.parentElement.insertBefore(childNode, this.element)
  }
}

export default NodeRep

export class TextRep extends NodeRep<Text> {
  constructor(public props: Var<string> | string) {
    super(props)
  }
  _render(): Text {
    let obs = this.props
    var node: Text
    if (typeof obs === 'string') {
      node = document.createTextNode(obs)
    } else {
      node = document.createTextNode(obs())
      Obs<string, {}>(obs, (n) => {
        node.textContent =  n
      })
    }
    return this.element = node
  }
}
