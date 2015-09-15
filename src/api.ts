import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop, Class, Value, Style} from './directives/index'
import {Var} from './overkill/index'

export {Component} from './tags/component'
export * from './tags/index'
export {Tag} from './tags/elementRep'
export * from './tags/for'
export * from './tags/if'
export * from './decorator'


const directiveMapping = {
  value: Value,
  class: Class,
  style: Style
}

export function p(name: string[]) {
  let diretiveConstructor = directiveMapping[name[0]]
  if (diretiveConstructor) {
    let directive = new diretiveConstructor()
    return directive.toString()
  }
  let prop = new Prop(name[0])
  return prop.toString()
}

export type KVData = {[k:string]: string}
