import {Var, Sig, Obs, isSignal, ObsImp} from '../overkill/index'
import {ArrayDiffChecker} from '../diff/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

export class ForImpl<T, E extends ChildTag> extends NodeRep<DocumentFragment> {
  private children: NodeRep<Node>[] = []
  private _anchorBegin: Node
  private _anchorEnd: Node
  private obs: ObsImp<T[], {}>

  constructor(
    private signal: Sig<T[]>,
    private func: (t: T, i: number) => E) {
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
        this.children.push(childTag as any)
      }
      append(fragment, childTag)
    }
    fragment.appendChild(anchorEnd)
    this.obs = this.obs || Obs.byDiff(ArrayDiffChecker)(observable, (newVal: T[], k) => {
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
          this.children.push(<any>childTag)
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

export function For<T, E extends ChildTag>(obs: Sig<T[]> , func: (t: T, i: number) => E): ForImpl<T, E>
export function For<T, E extends ChildTag>(obs: T[] , func: (t: T, i: number) => E): ForImpl<T, E>
export function For<T, E extends ChildTag>(obs: T[] | Sig<T[]>, func: (t: T, i: number) => E): ForImpl<T, E> {
  if (Array.isArray(obs)) {
    return new ForImpl<T, E>(Var(obs), func)
  } else {
    return new ForImpl<T, E>(obs, func)
  }
}
