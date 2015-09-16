import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

interface StyleDef {
  [prop: string]: string
}

function convertObjectToStyle(style: StyleDef): string {
  return Object.keys(style).map(k => `${camelToSpinal(k)}: ${style[k]}`).join(';')
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
function camelToSpinal(clsName: string) {
  let spinal = clsName.replace(/[A-Z](?![A-Z])/g, (s) => {
    return '-' + s
  }).replace(/^-/, '').toLowerCase()
  // a custom element must have hyphen in it
  return spinal
}
