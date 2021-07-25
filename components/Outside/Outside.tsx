import React, { createRef, FC, MouseEventHandler, useEffect } from "react";

interface IOutside {
  onOutsideClick?: MouseEventHandler
}

const hasParrent = (elem: HTMLElement, parrent: HTMLElement) => {
  if (parrent == elem)
    return true

  if (elem == document.body)
    return false

  elem = elem.parentElement

  if (elem instanceof HTMLElement)
    return hasParrent(elem, parrent)

  return false
}

export const Outside: FC<IOutside> = ({ children, ...props }) => {
  const { onOutsideClick = () => { } } = props

  const childs = [].concat(children)
    .map((child, key) => {
      if (!child['key'])
        child = { ...child, key: `c${key}` }

      if (!child['ref'])
        child = { ...child, ref: createRef<HTMLElement>() }

      return child
    })


  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const { target } = e

      if (!(target instanceof HTMLElement))
        return

      for (let { ref } of childs) {
        if (!ref.current)
          continue

        if (!hasParrent(target, ref.current))
          return onOutsideClick(e as any)
      }
    }

    addEventListener('click', onClick)

    return () =>
      removeEventListener('click', onClick)
  })

  return (
    <>
      {childs}
    </>
  )
}