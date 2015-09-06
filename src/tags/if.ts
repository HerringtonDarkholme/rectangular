import {Sig, Var, Obs, isSignal, dispose, ObsImp} from '../overkill/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

export class IfImpl<E extends NodeRep<Node>> extends NodeRep<DocumentFragment> {
  private child: E
  private _anchorBegin: Node
  private _anchorEnd: Node
  private watcher: ObsImp<{}, {}>
  constructor(
    private obs: Sig<boolean>,
    private func: () => E
  ) {
    super()
    let paramName = getParamNames(func)[0] || '_'
    let funcName = func['name'] || 'anonymous_func'
    this._anchorBegin = createAnchor(`begin: If ${paramName} in ${funcName}`, true)
    this._anchorEnd = createAnchor(`end: If ${paramName} in ${funcName}`, true)
  }
  _render() {
    let fragment = document.createDocumentFragment()
    let func = this.func
    let anchorBegin = this._anchorBegin
    let anchorEnd = this._anchorEnd
    let obs = this.obs
    fragment.appendChild(anchorBegin)
    let bool = obs()
    this.watcher = Obs(obs, (newVal) => {
      if (newVal) {
        this.child = func()
        let parentNode = anchorBegin.parentNode
        parentNode.insertBefore(this.child._render(), anchorEnd)
      } else {
        this.child._remove()
      }
    })
    if (bool) {
      this.child = func()
      fragment.appendChild(this.child._render())
    }
    fragment.appendChild(anchorEnd)
    return fragment
  }

  _remove() {
    if (this.child) {
      this.child._remove()
      this.child = null
    }
    let parent = this._anchorBegin.parentNode
    if (parent) {
      parent.removeChild(this._anchorBegin)
      parent.removeChild(this._anchorEnd)
    }
    this.watcher.dispose()
    this._anchorBegin = null
    this._anchorEnd = null
  }
}

export function If<E extends NodeRep<Node>>(obs: boolean, func: () => E): IfImpl<E>
export function If<E extends NodeRep<Node>>(obs: Sig<boolean>, func: () => E): IfImpl<E>
export function If<E extends NodeRep<Node>>(obs: boolean | Sig<boolean>, func: () => E): IfImpl<E> {
  if (typeof obs === 'boolean') {
    return new IfImpl<E>(Var(obs), func)
  } else {
    return new IfImpl<E>(obs, func)
  }
}
