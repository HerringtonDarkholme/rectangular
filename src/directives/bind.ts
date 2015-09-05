import Directive from './directive'
import {Sig, ObsImp, Obs} from '../overkill/index'
import {ElementRep} from '../tags/elementRep'

export class Bind extends Directive<Sig<string>> {
  private watcher: ObsImp<{}, {}>
  constructor(public name: string) {
    super()
  }
  bind<E extends ElementRep<Element>>(e: E) {
    let element = e.element
    let attrName = this.name
    let v = this.v()
    this.watcher = Obs(v, function(newValue) {
      element.setAttribute(attrName, newValue)
    })
  }
  unbind<E extends ElementRep<Element>>(ele: E): void {
    this.watcher.dispose()
    super.unbind(ele)
  }
}
