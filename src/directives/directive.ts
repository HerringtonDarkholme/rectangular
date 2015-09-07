import {ObsImp, Var, Obs, Sig, dispose} from '../overkill/index'
import verifier from './verifier'
import NodeRep from '../tags/nodeRep'

// cannot use non-enumerable Symbol here
function makeId() {
  return Math.random().toString(36).substr(2, 5)
}

abstract class Directive<V> {
  private _id = makeId()
  public name: string
  public v: Sig<V> = Var<V>(undefined)
  protected o: ObsImp<any, {}>

  abstract bind<E extends NodeRep<Node>>(ele: E): void

  unbind<E extends NodeRep<Node>>(ele: E): void {
    this.o.dispose()
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
export default Directive
