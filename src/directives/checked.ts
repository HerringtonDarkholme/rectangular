import {Prop} from './prop'
import {Tag} from '../tags/elementRep'
import {Obs, Var} from '../overkill/index'
import eventManager from '../events/index'

export class Checked extends Prop<boolean> {
  private handler: Function
  public v: Var<boolean>
  bind<E extends Tag<HTMLInputElement>>(ele: E) {
    let directive = this
    let element = ele.element
    if (!(element instanceof HTMLInputElement)) return
    super.bind(ele)
    this.handler = function() {
      directive.v(this.checked)
    }
    eventManager.on(element, 'change', this.handler)
    this.o = Obs(this.v, function(newValue) {
      element.checked = newValue
    })
  }
  unbind<E extends Tag<HTMLInputElement>>(ele: E) {
    super.unbind(ele)
    eventManager.off(ele.element, 'change', this.handler)
  }
}
