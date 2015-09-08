import {Sig, Var, Obs, isSignal, dispose, ObsImp} from '../overkill/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames} from './util'

const EMPTY_NODE_SINGLETON: any = {
  _render() {
    // https://dom.spec.whatwg.org/#concept-node-insert
    return document.createDocumentFragment()
  },
  _remove() {}
}

export class IfImpl<E extends NodeRep<Node>> extends NodeRep<DocumentFragment> {
  private child: E = EMPTY_NODE_SINGLETON
  private _anchorBegin: Node
  private _anchorEnd: Node
  private watcher: ObsImp<void, {}>
  protected sigs: Sig<boolean>[]
  protected funcs: Array<() => E>
  constructor(
    sig: Sig<boolean>,
    func: () => E
  ) {
    super()
    this.sigs = [sig]
    this.funcs = [func]
    let paramName = getParamNames(func)[0] || '_'
    let funcName = func['name'] || 'anonymous_func'
    this._anchorBegin = createAnchor(`begin: If ${paramName} in ${funcName}`, true)
    this._anchorEnd = createAnchor(`end: If ${paramName} in ${funcName}`, true)
  }
  _render() {
    let fragment = document.createDocumentFragment()
    let funcs = this.funcs
    let anchorBegin = this._anchorBegin
    let anchorEnd = this._anchorEnd
    let sigs = this.sigs
    fragment.appendChild(anchorBegin)
    fragment.appendChild(anchorEnd)
    this.watcher = Obs(() => {
      let func: () => E
      for (let i = 0, l = sigs.length; i < l; i++) {
        if (sigs[i]()) {
          func = this.funcs[i]
          break
        }
      }
      this.child._remove()
      this.child = func ? func() : EMPTY_NODE_SINGLETON
      let parentNode = anchorBegin.parentNode
      parentNode.insertBefore(this.child._render(), anchorEnd)
    })
    return fragment
  }

  _remove() {
    this.child._remove()
    this.child = null
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

class EnhancedIf<E extends NodeRep<Node>> extends IfImpl<E> {
  ElseIf(sig: Sig<boolean>, func: () => E): EnhancedIf<E> {
    this.sigs.push(sig)
    this.funcs.push(func)
    return this
  }

  Else(func: () => E): IfImpl<E> {
    this.sigs.push(Var(true))
    this.funcs.push(func)
    return this
  }
}

export function If<E extends NodeRep<Node>>(sig: boolean, func: () => E): EnhancedIf<E>
export function If<E extends NodeRep<Node>>(sig: Sig<boolean>, func: () => E): EnhancedIf<E>
export function If<E extends NodeRep<Node>>(sig: boolean | Sig<boolean>, func: () => E): EnhancedIf<E> {
  if (typeof sig === 'boolean') {
    return new EnhancedIf<E>(Var(sig), func)
  } else {
    return new EnhancedIf<E>(sig, func)
  }
}
