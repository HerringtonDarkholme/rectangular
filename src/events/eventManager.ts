interface EventPlugin {
  isDefinedEvent(eventName: string): boolean
  addListener(ele: HTMLElement, eventName: string, handler: Function): boolean
  removeListener(ele: HTMLElement, eventName: string, handler: Function): boolean
}

class EventManager {
  constructor(private plugins: EventPlugin[]) {
  }
  on(ele, eventName, handler) {
    for (let plugin of this.plugins) {
      if (!plugin.isDefinedEvent(eventName)) continue
      let stopBind = plugin.addListener(ele, eventName, handler)
      if (stopBind) break
    }
  }
  off (ele, eventName, handler) {
    for (let plugin of this.plugins) {
      if (!plugin.isDefinedEvent(eventName)) continue
      let stopBind = plugin.removeListener(ele, eventName, handler)
      if (stopBind) break
    }
  }
}
