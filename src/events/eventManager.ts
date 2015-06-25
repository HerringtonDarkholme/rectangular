import {DomEvent} from './domEvent'

export interface EventPlugin {
  isDefinedEvent(eventName: string): boolean
  addListener(ele: HTMLElement, eventName: string, handler: Function): boolean
  removeListener(ele: HTMLElement, eventName: string, handler: Function): boolean
}

export class EventManager {
  constructor(private plugins: EventPlugin[]) {
  }
  on(ele, eventName, handler) {
    for (let plugin of this.plugins) {
      if (!plugin.isDefinedEvent(eventName)) continue
      let continueBind = plugin.addListener(ele, eventName, handler)
      if (continueBind) break
    }
  }
  off (ele, eventName, handler) {
    for (let plugin of this.plugins) {
      if (!plugin.isDefinedEvent(eventName)) continue
      let continueUnbind = plugin.removeListener(ele, eventName, handler)
      if (continueUnbind) break
    }
  }
}

var eventManager = new EventManager([new DomEvent()])

export default eventManager
