import { FC, ReactElement } from "react"

type TChooseChild = ReactElement<
  (typeof When) | (typeof Other)
> | TChooseChild[]

interface IChoose {
  children?: TChooseChild
}

interface IWhen {
  condition: any
}

export const When: FC<IWhen> = ({children}) => children as any
export const Other: FC = ({children}) => children as any

export const Choose: FC<IChoose> = ({children}) => {
  const childs = [].concat(children)

  for(let child of childs) {
    const {type, props} = child || {}
    const {condition = false, children = null} = props || {}
    
    if(type == Other)
      return children as any

    if(type == When && condition)
      return children
  }

  return null
}