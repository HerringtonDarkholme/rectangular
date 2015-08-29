import Observable from '../observable'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

class ForImpl<T> extends NodeRep<DocumentFragment> {
  private children: NodeRep<Node>[] = []
  private _anchorBegin: Node
  private _anchorEnd: Node

  constructor(
    private obs: T[] | Observable<T[]>,
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

    let obs: T[] = Array.isArray(observable) ? observable : (<any>observable).v

    for (let child of obs) {
      let childTag = func(child)
      if (childTag instanceof NodeRep) {
        this.children.push(childTag)
      }
      append(fragment, childTag)
    }
    fragment.appendChild(anchorEnd)
    if (observable instanceof Observable) {
      observable.onChange((oldVal: T[], newVal: T[]) => {
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
    }
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
    this._anchorBegin = null
    this._anchorEnd = null
  }
}

export function For<T>(obs: Observable<T[]> , func: (t: T) => ChildTag): NodeRep<DocumentFragment>
export function For<T>(obs: T[] , func: (t: T) => ChildTag): NodeRep<DocumentFragment>
export function For<T>(obs: T[] | Observable<T[]>, func: (t: T) => ChildTag): NodeRep<DocumentFragment> {
  return new ForImpl<T>(obs, func)
}
