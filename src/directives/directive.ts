import Observable from '../observable'
import verifier from './verifier'
import {ElementRep} from '../tags/elementRep'

// cannot use non-enumerable Symbol here
function makeId() {
  return Math.random().toString(36).substr(2, 5)
}

export default class Directive<V> extends Observable<V> {
  private _id = makeId()
  public name: string
  bind<E extends Element>(ele: E, value: any) {}

  uniqueId() {
    return this.name + '@_@' + this._id
  }
  toString() {
    verifier.put(this)
    return this.uniqueId()
  }
}
