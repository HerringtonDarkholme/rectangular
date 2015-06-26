import {DomEvent} from './domEvent'
import {EventManager} from './eventManager'

var eventManager = new EventManager([new DomEvent()])

export default eventManager
export {EventManager, EventPlugin} from './eventManager'
export {DomEvent} from './domEvent'
