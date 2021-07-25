import "./Switch.sass";

import React, { createContext, FC, ReactElement, useContext, useState } from "react";

type TSwitchChildren = ReactElement<typeof Route> | TSwitchChildren[]

interface IRoute {
  default?: boolean
  route: string
}

interface ISwitch {
  default?: string
  children: TSwitchChildren
}

export const Route: FC<IRoute> = () => null

export const SwitchContext = createContext((v: string) => {
  console.log('Switch to ' + v)
})

export const useSwitch = () => {
  return useContext(SwitchContext)
}

export const Switch = ({children, default: d}: ISwitch) => {
  const ctx = useSwitch()

  const childs = [].concat(children)
    .filter(e => e?.type == Route) as ReactElement<typeof Route>[]

  const start = childs.find(e => e?.props['route'] == d) ||
    childs.find(e => e?.props['default']) || childs[0]

  const [route, setRoute] = useState(
    () => start?.props['route'] as string
  )

  const selectRoute = (v: string) => {
    if(!childs.find(e => e?.props?.['route'] == v))
      return ctx(v)

    setRoute(v)
  }

  const find = childs.find(e => e?.props['route'] == route)

  return (
    <SwitchContext.Provider value={selectRoute}>
      {find.props['children']}
    </SwitchContext.Provider>
  )
}