import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

export class Attr<V> extends Directive<V> {
  constructor(public name: string, value?: V) {
    super(value)
  }
  bind<E extends Tag<HTMLElement>>(ele: E) {
    let key = this.name
    Obs(() => {
      let newValue = this.v().toString()
      write(() => ele.element.setAttribute(key, newValue))
    })
  }
}
