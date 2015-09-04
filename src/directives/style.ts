import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

interface StyleDef {
  [prop: string]: string
}

function convertObjectToStyle(style: StyleDef): string {
  return Object.keys(style).map(k => `${k}: ${style[k]}`).join(';')
}

export class Style extends Directive<StyleDef> {
  bind<E extends ElementRep<HTMLElement>>(ele: E) {
    super.bind(ele)
    let element = ele.element
    let value = this.v()
    write(() => {
      element.setAttribute('style', convertObjectToStyle(value))
    })
    Obs(this.v, (newValue) => {
      write(() => {
        element.setAttribute('style', convertObjectToStyle(newValue))
      })
    })
  }
}
