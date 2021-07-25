import "./Menu.sass";

import React, { FC, ReactElement } from "react";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { For } from "components/For/For";
import { Choose } from "components/Choose";
import { Other, When } from "components/Choose";

type TMenuChild = ReactElement<typeof MenuItem> | TMenuChild[]

interface IMenu {
  title: string
  children?: TMenuChild
  onSelect?: (v: string) => any
  onCancel?: (v: string) => any
}

interface IMenuItem {
  value?: string
  cancel?: boolean
}

export const MenuItem: FC<IMenuItem> = () => null

export const Menu = ({ children, ...props }: IMenu) => {
  const childs = [].concat(children)
    .filter(e => e?.type == MenuItem) as ReactElement<FC<IMenuItem>>[]

  const {
    title = '',
    onSelect = () => { },
    onCancel = () => {}
  } = props

  return (
    <>
      <Text>{title}</Text>

      <For of={childs}>
        {({ props }) => (
          <Choose>
            <When condition={!props?.['cancel']}>
              <Button onClick={() => onSelect(props?.['value'])}>
                {props?.['children']}
              </Button>
            </When>
            <Other>
              <Button secondary onClick={() => onCancel(props?.['value'])}>
                {props?.['children']}
              </Button>
            </Other>
          </Choose>

        )}
      </For>
    </>
  )
}