import {Component, p, Tag, For, If, KVData, Template} from '../src/api'
import {OK, HTML} from '../src/api'

let {div, input, label} = HTML
let {ul, li, dl, dd, dt} = HTML
let {Obs, Var, Rx} = OK

interface Todo {
  text: string
  done: boolean
}

function render({newTodo, todos, length}: MyComponent) {
  var inp = input({class: 'heheh', [p`value`]: newTodo, keydown(e) {e.which === 13 && submit()}})
  var submit = function() {
      Var.mutate(todos, t => t.push(
        {text: newTodo(), done: false}
      ))
      newTodo('')
  }

  return (
    div({class: 'control-form'},
      div('ewwwee'),
      div(newTodo),
      inp,
      div({class: 'btn',click() {submit()}}, 'add'),
      div(length),

      If(Rx(_ => length() > 5),
         () => div({class: 'warn'}, 'Too many todos!')
      ).Else(() => div('just fine')),

      For(todos, (t, i) => {
        var click = () => Var.mutate(todos, (e) => {
          var todo = {text: e[i].text, done: !e[i].done}
          e.splice(i, 1, todo)
          return false
        })
        return label({class: t.done ? 'done' : ''},
          input({type: 'checkbox', click, checked: t.done}),
          t.text
        )
      })
    )
  )
}

@Template(render)
class MyComponent extends Component {
  newTodo = Var('123')
  todos = Var([
    {text: 'make', done: false},
    {text: 'install', done: false},
    {text: 'exe', done: false},
  ])
  length = Rx(_ => this.todos().length)
}

function mount(elem: Tag<HTMLElement>) {
  document.body.appendChild(elem._render())
}

var btnText: any
let btnStyle: KVData = {
  color: 'red'
}
var btn = div({class: 'btn btn-lg', style: btnStyle, click() {alert('button clicked!')}},
  btnText = Var('test')
);

// mount(ul(
//   li('123'),
//   li('123'),
//   li('123'),
//   For([1,2,3,4], (v) => li(''+v))
// ))

var change = div({class: 'btn', click(e) {btnText(Math.random())}}, 'change text');
mount(btn)
mount(change)
mount(new MyComponent)

