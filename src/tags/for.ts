import {Var, Obs, isSignal, dispose} from '../overkill/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

class ForImpl<T> extends NodeRep<DocumentFragment> {
  private children: NodeRep<Node>[] = []
  private _anchorBegin: Node
  private _anchorEnd: Node

  constructor(
    private obs: Var<T[]>,
    private func: (t: T) => ChildTag) {
    super()
    let paramName = getParamNames(func)[0] || '_'
    let funcName = func['name'] || 'anonymous_func'
    this._anchorBegin = createAnchor(`begin: For ${paramName} in ${funcName}`, true)
    this._anchorEnd = createAnchor(`end: For ${paramName} in ${funcName}`, true)
  }
  _render() {
    let fragment = document.createDocumentFragment()
    let func = this.func
    let anchorBegin = this._anchorBegin
    let anchorEnd = this._anchorEnd
    let observable = this.obs

    fragment.appendChild(anchorBegin)

    let obs: T[] = observable()

    for (let child of obs) {
      let childTag = func(child)
      if (childTag instanceof NodeRep) {
        this.children.push(childTag)
      }
      append(fragment, childTag)
    }
    fragment.appendChild(anchorEnd)
    Obs(observable, (newVal: T[]) => {
      this.removeChildren()
      let func = this.func
      let fragment = document.createDocumentFragment()
      var childNode = anchorBegin.nextSibling
      let parentNode = anchorBegin.parentNode
      for (let t of newVal) {
        let childTag = func(t)
        append(fragment, childTag)
        if (childTag instanceof NodeRep) {
          this.children.push(childTag)
        }
      }
      parentNode.insertBefore(fragment, anchorEnd)
    })
    return fragment
  }
  removeChildren() {
    for (let child of this.children) {
      child.remove()
    }
    this.children = []
  }

  remove() {
    this.removeChildren()
    let parent = this._anchorBegin.parentNode
    if (parent) {
      parent.removeChild(this._anchorBegin)
      parent.removeChild(this._anchorEnd)
    }
    dispose(this.obs)
    this._anchorBegin = null
    this._anchorEnd = null
  }
}

export function For<T>(obs: Var<T[]> , func: (t: T) => ChildTag): NodeRep<DocumentFragment>
export function For<T>(obs: T[] , func: (t: T) => ChildTag): NodeRep<DocumentFragment>
export function For<T>(obs: T[] | Var<T[]>, func: (t: T) => ChildTag): NodeRep<DocumentFragment> {
  if (Array.isArray(obs)) {
    return new ForImpl<T>(Var(obs), func)
  } else {
    return new ForImpl<T>(obs, func)
  }
}
