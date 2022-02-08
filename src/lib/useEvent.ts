import { useEffect } from "react";

type TRef<T> = T | { current: T; };
type TLis<T> = (e: T) => any;

function useEvent<K extends keyof WindowEventMap>(k: K, l: TLis<WindowEventMap[K]>): void;
function useEvent<K extends keyof HTMLElementEventMap>(o: TRef<HTMLElement>, k: K, l: TLis<HTMLElementEventMap[K]>): void;
function useEvent(...args: any[]): void {
  const [listener, key, obj = window] = args.reverse();

  useEffect(() => {
    const e = (obj?.['current'] || obj) as EventTarget;
    if (e.addEventListener instanceof Function) {
      e.addEventListener(key, listener);
      return () => e.removeEventListener(key, listener);
    }
  });
}

export { useEvent };