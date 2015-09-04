import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import Directive, {Prop, Class, Value} from './directives/index'
import {Var} from './overkill/index'

export {Component} from './tags/component'
export * from './tags/index'
export {Tag} from './tags/elementRep'
export * from './tags/for'
export * from './tags/if'


const directiveMapping = {
  value: Value,
  class: Class,
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

export function t(initial: string[]) {
  return Var(initial[0])
}
