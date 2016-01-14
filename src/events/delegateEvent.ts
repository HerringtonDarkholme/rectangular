import {EventPlugin} from './eventManager'

class DelegateEvent implements EventPlugin {
  // eventName: delegate-click-childElement
  isDefinedEvent(eventName: string): boolean {
    return eventName.indexOf('delegate-') === 0
  }

  addListener(ele: HTMLElement, eventName: string, handler: Function) {
    let [, event, tagName] = eventName.split('-')
    function delegate(e) {
      if (!(e.target instanceof HTMLElement)) return
      let target: HTMLElement = e.target
      while (target !== ele) {
        if (target.tagName === tagName) {
          handler.call(target, e)
        } else {
          target = <HTMLElement>target.parentNode
        }
      }
    }
    let eleDelegate = ele['__delegate__'] || {}
    let delegated: Function[] = eleDelegate[event] = eleDelegate[event] || []
    // no re-bind
    if (delegated.indexOf(handler) !== -1) return
    let delegator = eleDelegate[event + '__delegator__'] = eleDelegate[event + '__delegator__'] || []
    delegated.push(handler)
    delegator.push(delegate)
    ele.addEventListener(event, delegate)

    Object.defineProperty(ele, '__delegate__', {
      configurable: true,
      value: delegate
    })
    return false
  }
  removeListener(ele: HTMLElement, eventName: string, handler: Function) {
    let [, event, tagName] = eventName.split('-')
    let eleDelegate = ele['__delegate__'] || {}
    let delegated = eleDelegate[event]
    if (!delegated || delegated.indexOf(handler) < 0) return
    let index = delegated.indexOf(handler)
    let [delegator] = eleDelegate[event + '__delegator__'].splice(index, 1)
    delegated.splice(index, 1)
    ele.removeEventListener(event, delegator)
    return false
  }
}
