import Observable from '../observable'
import {ChildTag} from './nodeRep'

function For<T>(obs: T[], func: (t: T) => ChildTag): ChildTag[]
function For<T>(obs: Observable<T[]>, func: (t: T) => ChildTag): Observable<ChildTag[]>
function For<T>(obs: T[] | Observable<T[]>, func: (t: T) => ChildTag): any {
  if (obs instanceof Observable) {
    return obs.map((ts: T[]) => ts.map(func))
  }
  return (<T[]>obs).map(func)
}
