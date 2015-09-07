import {Prop} from './prop'
import {Tag} from '../tags/elementRep'
import {Obs, Var} from '../overkill/index'
import eventManager from '../events/index'

export class Value extends Prop<string> {
  private handler: Function
  public v: Var<string>
  constructor() {
    super('value')
  }

  bind<E extends Tag<HTMLInputElement>>(ele: E) {
    let directive = this
    let element = ele.element
    if (!(element instanceof HTMLInputElement)) return
    super.bind(ele)
    this.handler = function() {
      directive.v(this.value)
    }
    this.o = Obs(this.v, function(newValue) {
      element.value = newValue
    })
    eventManager.on(element, 'keyup', this.handler)
  }
  unbind<E extends Tag<HTMLInputElement>>(ele: E) {
    super.unbind(ele)
    eventManager.off(ele.element, 'keyup', this.handler)
  }
}
