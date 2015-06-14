import Observable from '../observable'
import {Prop, verifier} from '../prop'

export type ChildTag = string | Prop<string> | NodeRep<any>

export default class NodeRep<T extends Node> extends Observable<any> {
	protected _linkedProperties: {[a:string]: Prop<{}>} = {}
	constructor(props: any = {}) {
		super()
		for (let key in props) {
			let obs
			if (obs = verifier.pop(key))	{
        obs.value = props[key]
				this._linkedProperties[key] = obs
				this[obs.name] = obs
			}
		}
	}
	render(): T {
    throw new Error('Not Implemented')
	}
}

export class TextRep extends NodeRep<Text> {
  render(): Text {
		var node = document.createTextNode(this.value)
		this.onChange(function(_, newVal) {
			node.textContent = newVal
		})
		return node
  }
}

