import Directive from './directive'
import {ElementRep} from '../tags/elementRep'

export class Prop<V> extends Directive<V> {
  bind<E extends ElementRep<Element>>(ele: E, value: any) {
    let key = this.name
    this.onChange(function(oldValue, newValue) {
      ele[key] = newValue
    })
    ele[key] = value
  }
}
