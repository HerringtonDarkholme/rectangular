import Observable from '../observable'
import verifier from './verifier'
import NodeRep from '../tags/nodeRep'

// cannot use non-enumerable Symbol here
function makeId() {
  return Math.random().toString(36).substr(2, 5)
}

export default class Directive<V> extends Observable<V> {
  private _id = makeId()
  public name: string
  bind<E extends NodeRep<Node>>(ele: E, value: V): void {
    this.value = value
  }
  unbind<E extends NodeRep<Node>>(ele: E): void {
    this.value = null
    this.clearCallbacks()
  }

  uniqueId(): string {
    return this.name + '@_@' + this._id
  }
  toString(): string {
    verifier.put(this)
    return this.uniqueId()
  }
}
