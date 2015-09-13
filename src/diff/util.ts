export function zip<U, V>(a: U[], b: V[]): [U, V][] {
  let l = Math.min(a.length, b.length)
  let ret: [U, V][] = []
  for (let i = 0; i < l; i++) {
    ret.push([a[i], b[i]])
  }
  return ret
}
