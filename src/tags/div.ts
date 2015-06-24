import {Tag} from './elementRep'
import {ChildTag} from './nodeRep'
import {TagName} from '../decorator'


@TagName('div')
class Div extends Tag<HTMLDivElement> {}

export function div(props: any, ...children: ChildTag[]) {
  return new Div(props, children)
}

