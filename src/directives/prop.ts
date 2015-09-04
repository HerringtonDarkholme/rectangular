import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

export class Prop<V> extends Directive<V> {
  constructor(public name: string, value?: V) {
    super(value)
  }
  bind<E extends ElementRep<Element>>(ele: E) {
    let key = this.name
    Obs(() => {
      let newValue = this.v()
      write(() => ele.element[key] = newValue)
    })
    ele[key] = this.v
  }
}
