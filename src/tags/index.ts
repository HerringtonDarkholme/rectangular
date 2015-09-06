import {Tag} from './elementRep'
import {ChildTag, Child} from './nodeRep'
import {Sig} from '../overkill/index'
import {TagName} from '../decorator'
import {PROPERTY} from '../config'
import * as T from '../config'
import {ForImpl} from './for'

type T<E extends HTMLElement> = Tag<E> | ForImpl<{}, Tag<E>>

function t<E extends HTMLElement>(name: string) {
  return function(props: PROPERTY, ...children: ChildTag[]) {
    return new Tag<E>(name, props, children)
  }
}

var v: <E extends HTMLElement>(n: string) => (p: PROPERTY) => Tag<E> = t
var tp: <E extends HTMLElement, T>(n: string) => (p: PROPERTY & T, ...c: ChildTag[]) => Tag<E> = t
var vp: <E extends HTMLElement, T>(n: string) => (p: PROPERTY & T) => Tag<E> = t
var tc: <E extends HTMLElement, C>(n: string) => (p: PROPERTY, ...c: C[]) => Tag<E> = t
var tpc: <E extends HTMLElement, P, C>(n: string) => (p: PROPERTY&P, ...c: C[]) => Tag<E> = t
var ph: (n: string) => (p: PROPERTY, ...c: PHRASE[]) => Tag<HTMLPhraseElement> = t

type PHRASE = string | Sig<string> | T<HTMLPhraseElement | HTMLAudioElement | HTMLButtonElement | HTMLCanvasElement | HTMLDataListElement | HTMLEmbedElement | HTMLIFrameElement | HTMLImageElement | HTMLInputElement | HTMLLabelElement | HTMLMeterElement | HTMLObjectElement | HTMLProgressElement | HTMLQuoteElement | HTMLScriptElement | HTMLSelectElement | HTMLTextAreaElement | HTMLTimeElement | HTMLVideoElement | HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement | HTMLMapElement>

type METADATA =
  T<HTMLBaseElement | HTMLTitleElement | HTMLMetaElement | HTMLLinkElement | HTMLScriptElement | HTMLStyleElement>

type TABLE_CHILD = T<HTMLTableCaptionElement|HTMLTableColElement|HTMLTableSectionElement|HTMLTableRowElement>

export var a              = tp<HTMLAnchorElement, T.A>('c')
export var abbr           = ph('abbr')
export var address        = t<HTMLBlockElement>('address')
export var article        = t<HTMLElement>('article')
export var aside          = t<HTMLElement>('aside')
export var audio          = tp<HTMLAudioElement, T.AUDIO>('audio')
export var b              = ph('b')
export var bdo            = ph('bdo')
export var blockquote     = tp<HTMLBlockElement, T.BLOCKQUOTE>('blockquote')
export var body           = t<HTMLBodyElement>('body')
export var button         = tpc<HTMLButtonElement, T.BUTTON, PHRASE>('button')
export var canvas         = tp<HTMLCanvasElement, T.CANVAS>('canvas')
export var caption        = tc<HTMLTableCaptionElement, PHRASE>('caption')
export var cite           = ph('cite')
export var code           = ph('code')
export var colgroup       = tpc<HTMLTableColElement, T.COLGROUP, T<HTMLTableColElement>>('colgroup')
export var datalist       = tc<HTMLDataListElement, T<HTMLOptionElement>>('datalist')
export var dd             = t<HTMLDDElement>('dd')
export var del            = tp<HTMLModElement, T.DEL>('del')
export var details: (p: PROPERTY&T.DETAILS, s: T<HTMLSummaryElement>, ...c: ChildTag[]) => Tag<HTMLDetailsElement>
                          = tp<HTMLDetailsElement, T.DETAILS>('details')
export var dialog         = tpc<HTMLDialogElement, T.DIALOG, T<HTMLDTElement|HTMLDDElement>>('dialog')
export var dfn            = ph('dfn')
export var div            = t<HTMLDivElement>('div')
export var dl             = t<HTMLDListElement>('dl')
export var dt             = tc<HTMLDTElement, PHRASE>('dt')
export var em             = ph('em')
export var fieldset       = tp<HTMLFieldSetElement, T.FIELDSET>('fieldset')
export var figure         = t<HTMLElement>('figure')
// export var font           = t<HTMLFontElement>('font')
export var footer         = t<HTMLElement>('footer')
export var form           = tp<HTMLFormElement, T.FORM>('form')
export var h1             = tc<HTMLHeadingElement, PHRASE>('h1')
export var h2             = tc<HTMLHeadingElement, PHRASE>('h2')
export var h3             = tc<HTMLHeadingElement, PHRASE>('h3')
export var h4             = tc<HTMLHeadingElement, PHRASE>('h4')
export var h5             = tc<HTMLHeadingElement, PHRASE>('h5')
export var h6             = tc<HTMLHeadingElement, PHRASE>('h6')
export var head           = tc<HTMLHeadElement, METADATA>('head')
export var header         = t<HTMLElement>('header')
export var html: (p: PROPERTY&T.HTML, h: T<HTMLHeadElement>, b: T<HTMLBodyElement>) => Tag<HTMLElement>
                          = t('html')
export var i              = ph('i')
export var iframe         = tp<HTMLIFrameElement, T.IFRAME>('iframe')
export var ins            = tp<HTMLModElement, T.INS>('ins')
export var kbd            = ph('kbd')
export var label          = tpc<HTMLLabelElement, T.LABEL, PHRASE>('label')
export var legend         = tc<HTMLLegendElement, PHRASE>('legend')
export var li             = t<HTMLLIElement>('li')
export var map            = tp<HTMLMapElement, T.MAP>('map')
export var menu           = tp<HTMLMenuElement, T.MENU>('menu')
export var meter          = tpc<HTMLMeterElement, T.METER, PHRASE>('meter')
export var nav            = t<HTMLElement>('nav')
export var object         = tp<HTMLObjectElement, T.OBJECT>('object')
export var ol             = tpc<HTMLOListElement, T.OL, T<HTMLLIElement>>('ol')
export var optgroup       = tpc<HTMLOptGroupElement, T.OPTGROUP, T<HTMLOptionElement>>('optgroup')
export var option         = tpc<HTMLOptionElement, T.OPTION, string|Sig<string>>('option')
export var p              = tc<HTMLParagraphElement, PHRASE>('p')
export var pre            = tpc<HTMLPreElement, T.PRE, PHRASE>('pre')
export var progress       = tpc<HTMLProgressElement, T.PROGRESS, PHRASE>('progress')
export var q              = tpc<HTMLQuoteElement, T.Q, PHRASE>('q')
export var rp             = ph('rp')
export var rt             = ph('rt')
export var ruby           = ph('ruby')
export var s              = t<HTMLPhraseElement>('s')
export var samp           = ph('samp')
export var script         = tp<HTMLScriptElement, T.SCRIPT>('script')
export var section        = tp<HTMLElement, T.SECTION>('section')
export var select         = tpc<HTMLSelectElement, T.SELECT, T<HTMLOptGroupElement|HTMLOptionElement>>('select')
export var small          = ph('small')
export var span           = tc<HTMLSpanElement, PHRASE>('span')
export var strong         = ph('strong')
export var style          = tp<HTMLStyleElement, T.STYLE>('style')
export var sub            = ph('sub')
export var sup            = ph('sup')
export var table          = tc<HTMLTableElement, TABLE_CHILD>('table')
export var tbody          = tc<HTMLTableSectionElement, T<HTMLTableRowElement>>('tbody')
export var td             = tp<HTMLTableDataCellElement, T.TD>('td')
export var time           = tpc<HTMLTimeElement, T.TIME, PHRASE>('time')
export var textarea       = tpc<HTMLTextAreaElement, T.TEXTAREA, string|Sig<string>>('textarea')
export var tfoot          = tc<HTMLTableSectionElement, T<HTMLTableRowElement>>('tfoot')
export var th             = tp<HTMLTableHeaderCellElement, T.TH>('th')
export var thead          = tc<HTMLTableSectionElement, T<HTMLTableRowElement>>('thead')
export var title          = t<HTMLTitleElement>('title')
export var tr             = tc<HTMLTableRowElement, T<HTMLTableDataCellElement|HTMLTableHeaderCellElement>>('tr')
export var u              = t<HTMLPhraseElement>('u')
export var ul             = tc<HTMLUListElement, T<HTMLLIElement>>('ul')
export var video          = tp<HTMLVideoElement, T.VIDEO>('video')

// void element
export var area           = vp<HTMLAreaElement, T.AREA>('area')
export var base           = vp<HTMLBaseElement, T.BASE>('base')
export var br             = v<HTMLBRElement>('br')
export var col            = vp<HTMLTableColElement, T.COL>('col')
export var embed          = vp<HTMLEmbedElement, T.EMBED>('embed')
export var hr             = v<HTMLHRElement>('hr')
export var img            = vp<HTMLImageElement, T.IMG>('img')
export var input          = vp<HTMLInputElement, T.INPUT>('input')
export var keygen         = vp<HTMLBlockElement, T.KEYGEN>('keygen')
export var link           = vp<HTMLLinkElement, T.LINK>('link')
export var meta           = vp<HTMLMetaElement, T.META>('meta')
export var menuitem       = vp<HTMLMenuItemElement, T.MENUITEM>('menuitem')
export var param          = vp<HTMLParamElement, T.PARAM>('param')
export var source         = vp<HTMLSourceElement, T.SOURCE>('source')
export var track          = vp<HTMLTrackElement, T.TRACK>('track')

interface HTMLDetailsElement extends HTMLElement {
  open: boolean
}
interface HTMLDialogElement extends HTMLElement {
  open: boolean
}
interface HTMLSummaryElement extends HTMLElement {
  open: boolean
}
interface HTMLMenuItemElement extends HTMLElement {
  label: string,
  type: string
  icon: string,
  checked: boolean
  command?: HTMLElement
}

interface HTMLTimeElement extends HTMLElement {
  dateTime: string
}

interface HTMLMeterElement extends HTMLElement {
  value: number
  min: number
  low: number
  high: number
  max: number
  optimum: number
}
