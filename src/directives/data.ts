import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

interface DataDef {
  [key: string]: string
}

export class Data extends Directive<DataDef> {
  bind<E extends ElementRep<HTMLElement>>(ele: E, data: DataDef) {
    super.bind(ele, data)
    let element = ele.element
    write(() => {
      for (let key in Object.keys(data)) {
        element.setAttribute(`data-${key}`, data[key])
      }
    })
    Obs(this.v, (newValue, oldValue) => {
      write(() => {
        for (let key in Object.keys(oldValue)) {
          element.removeAttribute(`data-${key}`)
        }
        for (let key in Object.keys(newValue)) {
          element.setAttribute(`data-${key}`, data[key])
        }
      })
    })
  }
}
