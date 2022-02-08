import "./Menu.sass";

import { Button } from "components/Button";
import { Choose, Other, When } from "components/Choose";
import { For } from "components/For/For";
import { Text } from "components/Text";
import { FC, ReactElement } from "react";

type TMenuChild = ReactElement<typeof MenuItem> | TMenuChild[];

interface IMenu {
  title: string;
  children?: TMenuChild;
  onSelect?: (v: string) => any;
  onCancel?: (v: string) => any;
}

interface IMenuItem {
  value?: string;
  cancel?: boolean;
}

export const MenuItem: FC<IMenuItem> = () => null;

export const Menu = ({ children, ...props }: IMenu) => {
  const childs = ([].concat(children as any) as any[])
    .filter(e => e?.type == MenuItem) as ReactElement<FC<IMenuItem>>[];

  const {
    title = '',
    onSelect = () => { },
    onCancel = () => { }
  } = props;

  return (
    <>
      <Text>{title}</Text>

      <For of={childs}>
        {({ props }) => (
          <Choose>
            <When condition={!props.caller}>
              <Button onClick={() => onSelect((props as any).value)}>
                {(props as any).children}
              </Button>
            </When>
            <Other>
              <Button secondary onClick={() => onCancel((props as any).value)}>
                {(props as any).children}
              </Button>
            </Other>
          </Choose>

        )}
      </For>
    </>
  );
};