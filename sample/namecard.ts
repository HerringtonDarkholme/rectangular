import {Component, p, Tag, For, If, Template} from '../src/api'

import {OK, HTML} from '../src/api'

let {div, input, label} = HTML
let {ul, li, dl, dd, dt} = HTML
let {Obs, Var, Rx} = OK

function mount(elem: Tag<HTMLElement>) {
  document.body.appendChild(elem._render())
}
@Template(view)
class NameCard extends Component {
  firstName = Var('John') // observable
  lastName = Var('Smith') // as plain function
  // Rx is a computed observable, reactive to Var used in computation
  style = Var({fontSize: '12px'})
  fullName = Rx(_ => {
    let {firstName: fn, lastName: ln} = this
    // observable is auto binded to instance
    return `${fn()} ${ln()}`
  })
  enlarge() {
    Var.mutate(this.style, s => s.fontSize = '24px')
  }
}

function view(n: NameCard) {
  // Var can be reference type, change by `mutate` method

  // method as event listener, computed property for data passing and dom manipulation
  return div({[p`style`]: n.style, click() {n.enlarge()}},
    div('name'), // plain text
    div(n.fullName) // observable can also be used
  )
}

var a = new NameCard()
mount(a)
console.log(456)

setTimeout(() => {
  a.firstName('Smith')
  a.lastName('John')
}, 2000)
