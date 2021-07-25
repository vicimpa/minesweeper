import { Dispatch, useEffect, useState } from "react"

export interface ISharedState<T> {
  readonly state: T
  setState(v: T | ((v: T) => T)): T
  useState(): [T, ISharedState<T>['setState']]
}

export function makeSharedState<T>(initialState: T) {
  const subscribers: Dispatch<T>[] = []

  const mySetState = (v: T | ((v: T) => T)) => {
    if (v instanceof Function)
      v = v(initialState)

    initialState = v

    for(let sub of subscribers)
      sub(initialState)

    return initialState
  }

  const myUseState = (): [T, typeof mySetState] => {
    const setState = useState(initialState)[1]
 
    useEffect(() => {
      subscribers.push(setState)

      return () => {
        const index = subscribers.indexOf(setState)
        if(index != -1) subscribers.splice(index, 1)
      }
    })

    return [initialState, mySetState]
  }

  return {
    get state() { return initialState },
    setState: mySetState, 
    useState: myUseState
  } as ISharedState<T>
}