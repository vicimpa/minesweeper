import "./Text.sass";

import React, { forwardRef } from "react";

interface IText {
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean

  primary?: boolean
  secondary?: boolean

  left?: boolean
  center?: boolean
  right?: boolean

  size?: '1' | '2' | '3' | '4' | '5' | '6'
  color?: 'primary' | 'secondary'
  align?: 'left' | 'center' | 'right'
  children?: any
}

export const Text = forwardRef<HTMLParagraphElement, IText>(
  ({ children, ...props }, ref) => {
    for(let [key, value] of Object.entries(props)) {
      if(key[0] == 'h' && value)
        props.size = +key[1] as any
      
      if(/(left|right|center)/.test(key) && value)
        props.align = key as any

      if(/(primary|secondary)/.test(key) && value)
        props.color = key as any
    }

    const {
      size = '1',
      color = 'primary',
      align = 'center'
    } = props

    return (
      <p 
        className={'text-component'}
        ref={ref}
        data-size={size}
        data-color={color}
        data-align={align}
      >
        {children}
      </p>
    )
  }
)