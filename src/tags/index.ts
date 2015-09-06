import {Tag} from './elementRep'
import {ChildTag, Child} from './nodeRep'
import {TagName} from '../decorator'
import {PROPERTY} from '../config'
import * as T from '../config'

function t<E extends HTMLElement>(name: string) {
  return function(props: PROPERTY, ...children: ChildTag[]) {
    return new Tag<E>(name, props, children)
  }
}

var v: <E extends HTMLElement>(n: string) => (p: PROPERTY) => Tag<E> = t
var tp: <E extends HTMLElement, T>(n: string) => (p: PROPERTY & T, ...c: ChildTag[]) => Tag<E> = t
var vp: <E extends HTMLElement, T>(n: string) => (p: PROPERTY & T) => Tag<E> = t

export var a              = tp<HTMLAnchorElement, T.A>('c')
export var abbr           = t<HTMLPhraseElement>('abbr')
export var address        = t<HTMLBlockElement>('address')
export var audio          = tp<HTMLAudioElement, T.AUDIO>('audio')
export var b              = t<HTMLPhraseElement>('b')
export var bdo            = t<HTMLPhraseElement>('bdo')
export var blockquote     = tp<HTMLBlockElement, T.BLOCKQUOTE>('blockquote')
export var body           = t<HTMLBodyElement>('body')
export var button         = tp<HTMLButtonElement, T.BUTTON>('button')
export var canvas         = tp<HTMLCanvasElement, T.CANVAS>('canvas')
export var caption        = t<HTMLTableCaptionElement>('caption')
export var cite           = t<HTMLPhraseElement>('cite')
export var code           = t<HTMLPhraseElement>('code')
export var colgroup       = tp<HTMLTableColElement, T.COLGROUP>('colgroup')
export var datalist       = t<HTMLDataListElement>('datalist')
export var dd             = t<HTMLDDElement>('dd')
export var del            = tp<HTMLModElement, T.DEL>('del')
export var details: (p: PROPERTY&T.DETAILS, s: Tag<HTMLSummaryElement>, ...c: ChildTag[]) => Tag<HTMLDetailsElement>
                          = tp<HTMLDetailsElement, T.DETAILS>('details')
export var dialog         = tp<HTMLDialogElement, T.DIALOG>('dialog')
export var dfn            = t<HTMLPhraseElement>('dfn')
export var div            = t<HTMLDivElement>('div')
export var dl             = t<HTMLDListElement>('dl')
export var dt             = t<HTMLDTElement>('dt')
export var em             = t<HTMLPhraseElement>('em')
export var fieldset       = tp<HTMLFieldSetElement, T.FIELDSET>('fieldset')
export var font           = t<HTMLFontElement>('font')
export var form           = tp<HTMLFormElement, T.FORM>('form')
export var h1             = t<HTMLHeadingElement>('h1')
export var h2             = t<HTMLHeadingElement>('h2')
export var h3             = t<HTMLHeadingElement>('h3')
export var h4             = t<HTMLHeadingElement>('h4')
export var h5             = t<HTMLHeadingElement>('h5')
export var h6             = t<HTMLHeadingElement>('h6')
export var head           = t<HTMLHeadElement>('head')
export var html           = tp<HTMLHtmlElement, T.HTML>('html')
export var i              = t<HTMLPhraseElement>('i')
export var iframe         = tp<HTMLIFrameElement, T.IFRAME>('iframe')
export var ins            = tp<HTMLModElement, T.INS>('ins')
export var kbd            = t<HTMLPhraseElement>('kbd')
export var label          = tp<HTMLLabelElement, T.LABEL>('label')
export var legend         = t<HTMLLegendElement>('legend')
export var li             = t<HTMLLIElement>('li')
export var map            = tp<HTMLMapElement, T.MAP>('map')
export var menu           = tp<HTMLMenuElement, T.MENU>('menu')
export var object         = tp<HTMLObjectElement, T.OBJECT>('object')
export var ol             = tp<HTMLOListElement, T.OL>('ol')
export var optgroup       = tp<HTMLOptGroupElement, T.OPTGROUP>('optgroup')
export var option         = tp<HTMLOptionElement, T.OPTION>('option')
export var p              = t<HTMLParagraphElement>('p')
export var pre            = tp<HTMLPreElement, T.PRE>('pre')
export var progress       = tp<HTMLProgressElement, T.PROGRESS>('progress')
export var q              = tp<HTMLQuoteElement, T.Q>('q')
export var rt             = t<HTMLPhraseElement>('rt')
export var ruby           = t<HTMLPhraseElement>('ruby')
export var s              = t<HTMLPhraseElement>('s')
export var samp           = t<HTMLPhraseElement>('samp')
export var script         = tp<HTMLScriptElement, T.SCRIPT>('script')
export var section        = tp<HTMLElement, T.SECTION>('section')
export var select         = tp<HTMLSelectElement, T.SELECT>('select')
export var small          = t<HTMLPhraseElement>('small')
export var span           = t<HTMLSpanElement>('span')
export var strong         = t<HTMLPhraseElement>('strong')
export var style          = tp<HTMLStyleElement, T.STYLE>('style')
export var sub            = t<HTMLPhraseElement>('sub')
export var sup            = t<HTMLPhraseElement>('sup')
export var table          = t<HTMLTableElement>('table')
export var tbody          = t<HTMLTableSectionElement>('tbody')
export var td             = tp<HTMLTableDataCellElement, T.TD>('td')
export var time           = tp<HTMLTimeElement, T.TIME>('time')
export var textarea       = tp<HTMLTextAreaElement, T.TEXTAREA>('textarea')
export var tfoot          = t<HTMLTableSectionElement>('tfoot')
export var th             = tp<HTMLTableHeaderCellElement, T.TH>('th')
export var thead          = t<HTMLTableSectionElement>('thead')
export var title          = t<HTMLTitleElement>('title')
export var tr             = t<HTMLTableRowElement>('tr')
export var u              = t<HTMLPhraseElement>('u')
export var ul             = t<HTMLUListElement>('ul')
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
