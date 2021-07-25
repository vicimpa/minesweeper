import "./Button.sass";

import React, { forwardRef, MouseEventHandler } from "react";

interface IButton {
  disabled?: boolean

  primary?: boolean
  secondary?: boolean
  white?: boolean

  fill?: boolean
  center?: boolean

  radius?: boolean
  circle?: boolean

  color?: 'primary' | 'secondary' | 'white'
  size?: 'fill' | 'center'
  type?: 'radius' | 'circle'

  onClick?: MouseEventHandler

  children?: any
}

export const Button = forwardRef<HTMLButtonElement, IButton>(
  ({children, ...props}, ref) => {
    for(let [key, value] of Object.entries(props)) {
      if(/(radius|circle)/.test(key) && value)
        props.type = key as any
      
      if(/(fill|center)/.test(key) && value)
        props.size = key as any

      if(/(primary|secondary|white)/.test(key) && value)
        props.color = key as any
    }

    const {
      color = 'primary',
      size = 'fill',
      type = 'radius',
      onClick = () => {},
      disabled = false
    } = props

    return (
      <button 
        className={'button-component'}
        ref={ref}
        disabled={disabled}
        data-color={color}
        data-size={size}
        data-type={type}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)