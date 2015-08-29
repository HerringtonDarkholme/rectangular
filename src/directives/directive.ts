import {Var, Obs, dispose} from '../overkill/index'
import verifier from './verifier'
import NodeRep from '../tags/nodeRep'

// cannot use non-enumerable Symbol here
function makeId() {
  return Math.random().toString(36).substr(2, 5)
}

export default class Directive<V> {
  private _id = makeId()
  public name: string
  public v: Var<V>
  bind<E extends NodeRep<Node>>(ele: E, value: V): void {
    if (this.v) throw new Error('cannot rebind Directive')
    this.v = Var(value)
  }
  unbind<E extends NodeRep<Node>>(ele: E): void {
    dispose(this.v)
    this.v = null
  }

  uniqueId(): string {
    return this.name + '@_@' + this._id
  }
  toString(): string {
    verifier.put(this)
    return this.uniqueId()
  }
}
