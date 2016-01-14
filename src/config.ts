// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
var GLOBAL_ATTRIBUTES: GlobalAttributes = {
  'accesskey': '',
  'contenteditable': false,
  'contextmenu': '',
  'dir': '',
  'draggable': false,
  'dropzone': '',
  'hidden': false,
  'id': '',
  'spellcheck': false,
  'style': '',
  'tabindex': 0,
  'title': '',
  'translate': '',
  'class': <string[]>[],
  'data': <{[k:string]: string}>{},
  'aria': <{[k:string]: string}>{},
}

type KVData = {[k:string]: string}
type GlobalAttributes = {
  'accesskey'?: string,
  'contenteditable'?: boolean,
  'contextmenu'?: string,
  'dir'?: string,
  'draggable'?: boolean,
  'dropzone'?: string,
  'hidden'?: boolean,
  'id'?: string,
  'spellcheck'?: boolean,
  'tabindex'?: number,
  'title'?: string,
  'translate'?: string,
  'lang'?: string,
  'class'?: string | string[],
  'style'?: string | KVData,
  'data'?: KVData,
  'aria'?: KVData,
}

var EVENT = [
  'onabort',
  'onautocomplete',
  'onautocompleteerror',
  'onblur',
  'oncancel',
  'oncanplay',
  'oncanplaythrough',
  'onchange',
  'onclick',
  'onclose',
  'oncontextmenu',
  'oncuechange',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragexit',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onfocus',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreset',
  'onresize',
  'onscroll',
  'onseeked',
  'onseeking',
  'onselect',
  'onshow',
  'onsort',
  'onstalled',
  'onsubmit',
  'onsuspend',
  'ontimeupdate',
  'ontoggle',
  'onvolumechange',
  'onwaiting',
]
type EventAttributes = {
  "MSContentZoom"?: (ev: UIEvent) => any
  "MSGestureChange"?: (ev: MSGestureEvent) => any
  "MSGestureDoubleTap"?: (ev: MSGestureEvent) => any
  "MSGestureEnd"?: (ev: MSGestureEvent) => any
  "MSGestureHold"?: (ev: MSGestureEvent) => any,
  "MSGestureStart"?: (ev: MSGestureEvent) => any,
  "MSGestureTap"?: (ev: MSGestureEvent) => any,
  "MSInertiaStart"?: (ev: MSGestureEvent) => any,
  "MSManipulationStateChanged"?: (ev: MSManipulationEvent) => any,
  "MSPointerCancel"?: (ev: MSPointerEvent) => any,
  "MSPointerDown"?: (ev: MSPointerEvent) => any,
  "MSPointerEnter"?: (ev: MSPointerEvent) => any,
  "MSPointerLeave"?: (ev: MSPointerEvent) => any,
  "MSPointerMove"?: (ev: MSPointerEvent) => any,
  "MSPointerOut"?: (ev: MSPointerEvent) => any,
  "MSPointerOver"?: (ev: MSPointerEvent) => any,
  "MSPointerUp"?: (ev: MSPointerEvent) => any,
  "abort"?: (ev: UIEvent) => any,
  "activate"?: (ev: UIEvent) => any,
  "beforeactivate"?: (ev: UIEvent) => any,
  "beforedeactivate"?: (ev: UIEvent) => any,
  "blur"?: (ev: FocusEvent) => any,
  "canplay"?: (ev: Event) => any,
  "canplaythrough"?: (ev: Event) => any,
  "change"?: (ev: Event) => any,
  "click"?: (ev: MouseEvent) => any,
  "contextmenu"?: (ev: PointerEvent) => any,
  "dblclick"?: (ev: MouseEvent) => any,
  "deactivate"?: (ev: UIEvent) => any,
  "drag"?: (ev: DragEvent) => any,
  "dragend"?: (ev: DragEvent) => any,
  "dragenter"?: (ev: DragEvent) => any,
  "dragleave"?: (ev: DragEvent) => any,
  "dragover"?: (ev: DragEvent) => any,
  "dragstart"?: (ev: DragEvent) => any,
  "drop"?: (ev: DragEvent) => any,
  "durationchange"?: (ev: Event) => any,
  "emptied"?: (ev: Event) => any,
  "ended"?: (ev: Event) => any,
  "error"?: (ev: ErrorEvent) => any,
  "focus"?: (ev: FocusEvent) => any,
  "fullscreenchange"?: (ev: Event) => any,
  "fullscreenerror"?: (ev: Event) => any,
  "input"?: (ev: Event) => any,
  "keydown"?: (ev: KeyboardEvent) => any,
  "keypress"?: (ev: KeyboardEvent) => any,
  "keyup"?: (ev: KeyboardEvent) => any,
  "load"?: (ev: Event) => any,
  "loadeddata"?: (ev: Event) => any,
  "loadedmetadata"?: (ev: Event) => any,
  "loadstart"?: (ev: Event) => any,
  "mousedown"?: (ev: MouseEvent) => any,
  "mousemove"?: (ev: MouseEvent) => any,
  "mouseout"?: (ev: MouseEvent) => any,
  "mouseover"?: (ev: MouseEvent) => any,
  "mouseup"?: (ev: MouseEvent) => any,
  "mousewheel"?: (ev: MouseWheelEvent) => any,
  "mssitemodejumplistitemremoved"?: (ev: MSSiteModeEvent) => any,
  "msthumbnailclick"?: (ev: MSSiteModeEvent) => any,
  "pause"?: (ev: Event) => any,
  "play"?: (ev: Event) => any,
  "playing"?: (ev: Event) => any,
  "pointercancel"?: (ev: PointerEvent) => any,
  "pointerdown"?: (ev: PointerEvent) => any,
  "pointerenter"?: (ev: PointerEvent) => any,
  "pointerleave"?: (ev: PointerEvent) => any,
  "pointerlockchange"?: (ev: Event) => any,
  "pointerlockerror"?: (ev: Event) => any,
  "pointermove"?: (ev: PointerEvent) => any,
  "pointerout"?: (ev: PointerEvent) => any,
  "pointerover"?: (ev: PointerEvent) => any,
  "pointerup"?: (ev: PointerEvent) => any,
  "progress"?: (ev: ProgressEvent) => any,
  "ratechange"?: (ev: Event) => any,
  "readystatechange"?: (ev: ProgressEvent) => any,
  "reset"?: (ev: Event) => any,
  "scroll"?: (ev: UIEvent) => any,
  "seeked"?: (ev: Event) => any,
  "seeking"?: (ev: Event) => any,
  "select"?: (ev: UIEvent) => any,
  "selectstart"?: (ev: Event) => any,
  "stalled"?: (ev: Event) => any,
  "stop"?: (ev: Event) => any,
  "submit"?: (ev: Event) => any,
  "suspend"?: (ev: Event) => any,
  "timeupdate"?: (ev: Event) => any,
  "touchcancel"?: (ev: TouchEvent) => any,
  "touchend"?: (ev: TouchEvent) => any,
  "touchmove"?: (ev: TouchEvent) => any,
  "touchstart"?: (ev: TouchEvent) => any,
  "volumechange"?: (ev: Event) => any,
  "waiting"?: (ev: Event) => any,
  "webkitfullscreenchange"?: (ev: Event) => any,
  "webkitfullscreenerror"?: (ev: Event) => any,
  "wheel"?: (ev: WheelEvent) => any,
}

export type PROPERTY = GlobalAttributes & EventAttributes

export type A = {
  download?: string,
  href?: string,
  hreflang?: string,
  media?: string,
  rel?: string,
  rev?: string,
  target?: string,
  type?: string,
}

export type AREA = {
  alt: string,
  coords?: string,
  href?: string,
  nohref?: boolean,
  shape?: string,
  target?: string,
}

export type AUDIO = {
  autoplay?: boolean,
  controls?: boolean,
  loop?: boolean,
  muted?: boolean,
  preload?: boolean,
  src?: string,
}

export type BASE = {
  base: string,
  target?: string,
}

export type BLOCKQUOTE = {
  cite?: string
}

export type BUTTON = {
  autofocus?: boolean,
  disabled?: boolean,
  form?: string,
  formaction?: string,
  formenctype?: string,
  formmethod?: string,
  formnovalidate?: boolean,
  formtarget?: string,
  name?: string,
  /* button reset submit */
  type?: string,
  value?: string,
}

export type CANVAS = {
  height?: number,
  width?: number,
}

export type COL = {
  align?: string,
  char?: string,
  charoff?: number,
  span?: number,
  valign?: string,
  width?: string,
}

export type COLGROUP = COL

export type DEL = {
  cite?: string,
  datetime?: string,
}

export type DETAILS = {
  open?: boolean
}

export type DIALOG = {
  open?: boolean
}

export type EMBED = {
  height?: number,
  src?: string,
  type?: string,
  width?: number,
}

export type FIELDSET = {
  disabled?: boolean,
  form?: string,
  name?: string,
}

export type FORM = {
  'accept-charset'?: string,
  action?: string,
  autocomplete?: string,
  enctype?: string,
  method?: string,
  name?: string,
  novalidate?: boolean,
  target?: string
}

export type HTML = {
  manifest?: string,
  xmlns?: string
}

export type IFRAME = {
  height?: string | number,
  longdesc?: string,
  name?: string,
  sandbox?: string,
  seamless?: boolean,
  src?: string,
  srcdoc?: string,
  width?: number|string,
}

export type IMG = {
  alt: string,
  src: string,
  height?: number | string,
  width?: string | number,
  ismap?: string,
  usemap?: string,
}

export type INPUT = {
  type?: string,
  accept?: string,
  autocomplete?: string,
  autofocus?: boolean,
  autosave?: boolean,
  checked?: boolean,
  disabled?: boolean,
  form?: string,
  formaction?: string,
  formenctype?: string,
  formmethod?: string,
  formnovalidate?: boolean,
  formtarget?: string,
  height?: number,
  inputmode?: string,
  list?: string,
  max?: number,
  maxlength?: number,
  min?: number,
  minlength?: number,
  multiple?: boolean,
  name?: string,
  pattern?: string,
  placeholder?: string,
  readonly?: boolean,
  required?: boolean,
  selectionDirectrion?: string,
  size?: number,
  spellcheck?: string,
  step?: number,
  value?: string,
  width?: number,
}

export type INS = DEL

export type KEYGEN = {
  autofocus?: boolean,
  challenge?: string,
  disabled?: boolean,
  form?: string,
  keytype?: string,
  name?: string,
}

export type LABEL = {
  for?: string,
  form?: string,
}

export type LINK = {
  crossorigin?: string,
  disabled?: boolean,
  href?: string,
  hreflang?: string,
  media?: string,
  rel?: string,
  sizes?: string,
  type?: string,
  integrity?: string,
}

export type MAP = {
  name?: string,
  id: string,
}

export type MENU = {
  label?: string,
  type?: string,
}

export type MENUITEM = {
  checked?: boolean,
  default?: boolean,
  disabled?: boolean,
  icon?: string,
  open?: boolean,
  label: string,
  radiogroup?: string,
  type?: string,
}

export type META = {
  content: string,
  'http-equiv'?: string,
  name?: string,
}

export type METER = {
  form?: string,
  high?: number,
  low?: number,
  max?: number,
  min?: number,
  optimum?: number,
  value: number,
}

export type OBJECT = {
  data?: string,
  form?: string,
  height?: number,
  name?: string,
  type?: string,
  usemap?: string,
  width?: number,
  typemustmatch?: boolean,
}

export type OL = {
  reversed?: boolean,
  start?: string,
  type?: string,
}

export type OPTGROUP = {
  label: string,
  disabled?: boolean,
}

export type OPTION = {
  disabled?: boolean,
  label?: string,
  value?: string,
  selected?: boolean,
}

export type OUTPUT = {
  for?: string,
  form?: string,
  name?: string,
}

export type PARAM = {
  name?: string,
  value?: string,
}

export type PRE = {
  width?: number
}

export type PROGRESS = {
  max?: number,
  value?: number,
}

export type Q = {
  cite?: string
}

export type SCRIPT = {
  async?: boolean,
  src?: string,
  type?: string,
  text?: string,
  defer?: boolean,
  crossorigin?: boolean,
  integrity?: string,
}

export type SECTION = BLOCKQUOTE

export type SELECT = {
  autofocus?: boolean,
  disabled?: boolean,
  form?: string,
  multiple?: boolean,
  name?: string,
  required?: boolean,
  size?: number,
}

export type SOURCE = {
  media?: string,
  src?: string,
  type?: string | number
}

export type STYLE = {
  type?: string,
  media?: string,
  scoped?: boolean,
  title?: string,
  disabled?: boolean,
}

export type TD = {
  colspan?: number,
  headers?: string,
  rowspan?: number,
}

export type TEXTAREA = {
  autofocus?: boolean,
  cols?: number,
  disabled?: boolean,
  form?: string,
  maxlength?: number,
  name?: string,
  placeholder?: string,
  readonly?: boolean,
  required?: boolean,
  rows?: number,
  wrap?: string,
}

export type TH = {
  colspan?: number,
  headers?: string,
  rowspan?: number,
  scope?: string
}

export type TIME = {
  datetime?: string,
  pubdate?: string,
}

export type TRACK = {
  default?: boolean,
  kind?: string,
  label?: string,
  src?: string,
  srclang?: string
}

export type VIDEO = {
  autoplay?: boolean,
  buffered?: boolean,
  controls?: boolean,
  crossorigin?: string,
  height?: number,
  loop?: boolean,
  muted?: boolean,
  played?: string,
  preload?: boolean,
  poster?: string,
  src?: string,
  width?: number,
}
