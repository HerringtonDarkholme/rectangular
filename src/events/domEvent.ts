import {EventPlugin} from './eventManager'

export class DomEvent implements EventPlugin {
	isDefinedEvent(eventName: string): boolean {
		return true
	}

	addListener(ele: HTMLElement, eventName: string, handler: Function) {
		ele.addEventListener(eventName, <any>handler)
		return false
	}

	removeListener(ele: HTMLElement, eventName: string, handler: Function) {
		ele.removeEventListener(eventName, <any>handler)
		return false
	}
}
