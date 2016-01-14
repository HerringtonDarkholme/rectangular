declare module "easy-style" {
  function style(obj: CSSStyleDeclaration): string
  function rule(query: string, obj: CSSStyleDeclaration): string
  function keyframe(obj: {[step: string]: CSSStyleDeclaration}): string
}

declare module "prefix-lite" {
  export default function prefix(a: any): CSSStyleDeclaration
}
