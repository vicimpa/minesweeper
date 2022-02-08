import { createElement, Fragment, ReactElement } from "react";

type TChild<T> =
  ReactElement |
  ((item: T, index: number) => ReactElement) |
  TChild<T>[];

interface IFor<T> {
  of: T[];
  children?: TChild<T>;
}

export const For = <T>({ children, of: data }: IFor<T>) => {
  const output = [];
  const childs = [null].concat(children as any) as any;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    for (let child of childs) {
      if (typeof child != 'function') {
        output.push(child);
        continue;
      }

      output.push(child(item, i));
    }
  }

  return createElement(Fragment, {}, ...output);
};