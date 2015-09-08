import {Component, p, Tag, For, If} from './src/api'
import {div, input, label} from './src/tags/index'
import {Obs, Var, Rx, UpdatePolicy} from './src/overkill/index'
import {KVData} from './src/api'

import {ul, li} from './src/tags/index'

class MyComponent extends Component {
  render() {
    var obs = Var('123')
    var inp = input({class: 'heheh', [p`value`]: obs, keydown(e) {e.which === 13 && submit()}})
    var submit = function() {
        todos(todos().concat([obs()]))
        obs('')
    }

    return (
      div({class: 'control-form'},
        div({class: 'heheh'}, 'ewwwee'),
        div({class: 'heheh'}, obs),
        inp,
        div({class: 'btn',click() {submit()}}, 'add'),
        div({}, Rx(() => '' + todos().length)),
        If(Rx(() => todos().length > 5),
           () => div({class: 'warn'}, 'Too many todos!')
        ).Else(() => div({}, 'just fine'))
      ))
  }
}

function mount(elem) {
  document.body.appendChild(elem._render())
}

var btnText
let btnStyle: KVData = {
  color: 'red'
}
var btn = div({class: 'btn btn-lg', style: btnStyle, click() {alert('button clicked!')}},
  btnText = Var('test')
);

// mount(ul({},
//   li({}, '123'),
//   li({}, '123'),
//   li({}, '123'),
//   For([1,2,3,4], (v) => li({}, ''+v))
// ))

var change = div({class: 'btn', click(e) {btnText(Math.random())}}, 'change text');
var todos = Var(['make', 'install', 'exe'])
mount(btn)
mount(change)
mount(new MyComponent)
mount(For(todos, (t, i) => {
  var click = () => todos((e) => {
    e.splice(i, 1)
    return false
  }, UpdatePolicy.BY_REFERENCE)
  return label({},
    input({type: 'checkbox', click}),
    t
  )
}))
