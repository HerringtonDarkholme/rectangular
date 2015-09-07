import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

interface StyleDef {
  [prop: string]: string
}

function convertObjectToStyle(style: StyleDef): string {
  return Object.keys(style).map(k => `${k}: ${style[k]}`).join(';')
}

export class Style extends Directive<StyleDef> {
  bind<E extends Tag<HTMLElement>>(ele: E) {
    let element = ele.element
    let value = this.v()
    write(() => {
      element.setAttribute('style', convertObjectToStyle(value))
    })
    this.o = Obs(this.v, (newValue) => {
      write(() => {
        element.setAttribute('style', convertObjectToStyle(newValue))
      })
    })
  }
}
