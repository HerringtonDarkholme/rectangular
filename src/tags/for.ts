import {Var, Sig, Obs, isSignal, ObsImp} from '../overkill/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

class ForImpl<T> extends NodeRep<DocumentFragment> {
  private children: NodeRep<Node>[] = []
  private _anchorBegin: Node
  private _anchorEnd: Node
  private obs: ObsImp<T[], {}>

  constructor(
    private signal: Sig<T[]>,
    private func: (t: T, i: number) => ChildTag) {
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
    let observable = this.signal

    fragment.appendChild(anchorBegin)

    let obs: T[] = observable()

    for (let i = 0, l = obs.length; i < l; i++) {
      let child = obs[i]
      let childTag = func(child, i)
      if (childTag instanceof NodeRep) {
        this.children.push(childTag)
      }
      append(fragment, childTag)
    }
    fragment.appendChild(anchorEnd)
    this.obs = this.obs || Obs(observable, (newVal: T[]) => {
      this.removeChildren()
      let func = this.func
      let fragment = document.createDocumentFragment()
      var childNode = anchorBegin.nextSibling
      let parentNode = anchorBegin.parentNode
      for (let i = 0, l = newVal.length; i < l; i++) {
        let child = newVal[i]
        let childTag = func(child, i)
        append(fragment, childTag)
        if (childTag instanceof NodeRep) {
          this.children.push(childTag)
        }
      }
      parentNode.insertBefore(fragment, anchorEnd)
    })
    return fragment
  }

  private removeChildren() {
    for (let child of this.children) {
      child._remove()
    }
    this.children = []
  }

  _remove() {
    this.removeChildren()
    let parent = this._anchorBegin.parentNode
    if (parent) {
      parent.removeChild(this._anchorBegin)
      parent.removeChild(this._anchorEnd)
    }
    this.obs.dispose()
    this._anchorBegin = null
    this._anchorEnd = null
  }
}

export function For<T>(obs: Sig<T[]> , func: (t: T, i: number) => ChildTag): NodeRep<DocumentFragment>
export function For<T>(obs: T[] , func: (t: T, i: number) => ChildTag): NodeRep<DocumentFragment>
export function For<T>(obs: T[] | Sig<T[]>, func: (t: T, i: number) => ChildTag): NodeRep<DocumentFragment> {
  if (Array.isArray(obs)) {
    return new ForImpl<T>(Var(obs), func)
  } else {
    return new ForImpl<T>(obs, func)
  }
}
