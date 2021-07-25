import React, { FC, Fragment } from "react";

interface IIf {
  condition: any
}

export const If: FC<IIf> = ({condition, children}) => {
  const childs = [null].concat(children)

  if(!condition)
    return null

  return React.createElement(Fragment, {}, ...childs)
}