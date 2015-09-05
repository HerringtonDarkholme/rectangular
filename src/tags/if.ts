import {Sig, Var, Obs, isSignal, dispose, ObsImp} from '../overkill/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

class IfImpl<N extends Node> extends NodeRep<DocumentFragment> {
  private child: NodeRep<N>
  private _anchorBegin: Node
  private _anchorEnd: Node
  private watcher: ObsImp<{}, {}>
  constructor(
    private obs: Sig<boolean>,
    private func: () => NodeRep<N>
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

type FragRep = NodeRep<DocumentFragment>
export function If<N extends Node>(obs: boolean, func: () => NodeRep<N>): FragRep
export function If<N extends Node>(obs: Sig<boolean>, func: () => NodeRep<N>): FragRep
export function If<N extends Node>(obs: boolean | Sig<boolean>, func: () => NodeRep<N>): FragRep {
  if (typeof obs === 'boolean') {
    return new IfImpl<N>(Var(obs), func)
  } else {
    return new IfImpl<N>(obs, func)
  }
}
