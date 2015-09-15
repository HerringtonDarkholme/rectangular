A toy implementation of MVVM.

Feature:
====

* Type Safety
* Intuitive observable
* Leverage ES6

Example
===

See test.ts

```TypeScript
// view template injection
@Template(view)
class NameCard extends Component {
  firstName = Var('John') // observable
  lastName = Var('Smith') // as plain function
  // Rx is a computed observable, reactive to Var used in computation
  fullName = Rx(_ => {
    let {fullName: fn, lastName: ln} = this
    // observable is auto binded to instance
    return `${fn()} ${ln()}`
  })
}

function view(n: NameCard) {
  // Var can be reference type, change by `mutate` method
  var style = Var({fontSize: '12px'})
  var enlarge = () => Var.mutate(style, s => s.fontSize = '24px')

  // method as event listener, computed property for data passing and dom manipulation
  return dl(
    {[p`style`]: style, click() {enlarge()}},
    dt('name'), // plain text
    dd(n.fullName) // observable can also be used
  )
}

var a = new NameCard()
mount(a)

setTimeout(_ => {
  a.firstName('Smith')
  a.lastName('John')
}, 2000)
```
