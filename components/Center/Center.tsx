import "./Center.sass";

import React, { FC } from "react";

interface ICenter {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverce'
}

export const Center: FC<ICenter> = ({children, ...props}) => {
  const {
    direction = 'row'
  } = props

  return (
    <div data-direction={direction} className={`center-component`}>
      {children}
    </div>
  )
}