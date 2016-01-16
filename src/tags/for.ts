import {Var, Sig, Obs, isSignal, ObsImp} from '../overkill/index'
import {ArrayDiffChecker, Diff} from '../diff/index'
import NodeRep, {ChildTag} from './nodeRep'
import {append, createAnchor, getParamNames, normalizeChildTag} from './util'

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
    this.obs = this.obs || Obs.byDiff(ArrayDiffChecker)(observable, (newVal: T[], diff) => {
      console.log(diff)
      this.update(newVal, diff)
      // this.removeChildren()
      // let func = this.func
      // let fragment = document.createDocumentFragment()
      // var childNode = anchorBegin.nextSibling
      // let parentNode = anchorBegin.parentNode
      // for (let i = 0, l = newVal.length; i < l; i++) {
      //   let child = newVal[i]
      //   let childTag = normalizeChildTag(func(child, i))
      //   fragment.appendChild(childTag._render())
      //   this.children.push(childTag)
      // }
      // parentNode.insertBefore(fragment, anchorEnd)
    })
    return fragment
  }

  private update(newVal: T[], diff: Diff<T>) {
    let count = 0
    let anchorEnd = this._anchorEnd
    let parentNode = anchorEnd.parentElement
    let children = this.children
    for (let change of diff.changes) {
      while (count < +change.name) {
        count++
      }
      let child = children[count]
      if (!child) {
        if (change.type !== 'add') throw new Error('wrong diff in For tag')
        let newNodeRep = normalizeChildTag(this.func(change.value, count))
        children.push(newNodeRep)
        parentNode.insertBefore(newNodeRep._render(), anchorEnd)
        continue
      }
      if (change.type === 'update') {
        let newNodeRep = normalizeChildTag(this.func(newVal[count], count))
        let oldNodeRep = children.splice(count, 1, newNodeRep)[0]
        oldNodeRep.addRefBefore(newNodeRep)
        oldNodeRep._remove()
        continue
      }
      if (change.type === 'delete') {
        let oldNodeRep = children.splice(count, 1)[0]
        oldNodeRep._remove()
        continue
      }
    }
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

  addRefBefore(t: ChildTag) {
    let childNode = normalizeChildTag(t)._render()
    let parentNode = this._anchorBegin.parentNode
    parentNode.insertBefore(childNode, this._anchorBegin)
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
