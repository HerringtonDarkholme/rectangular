import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'

export class Prop<V> extends Directive<V> {
  constructor(public name: string) {
    super()
  }
  bind<E extends Element>(ele: E, value: any) {
    let key = this.name
    this.onChange(function(oldValue, newValue) {
      write(() => ele[key] = newValue)
    })
    ele[key] = value
  }
}
