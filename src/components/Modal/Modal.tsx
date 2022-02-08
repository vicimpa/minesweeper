import "./Modal.sass";

import { If } from "components/If";
import { Outside } from "components/Outside";
import { ISharedState, makeSharedState } from "lib/sharedState";
import React, { createContext, FC, ReactElement } from "react";
import { useContext, useEffect, useState } from "react";

interface IModal {
  direction?: 'bottom' | 'top' | 'left' | 'right';
  fullscreen?: boolean;
  modalRef?: IModalRef;
}

interface IModalRef {
  current?: ISharedState<ReactElement>;
}

type TModalContext = ISharedState<ReactElement>;

export const createModalRef = () => {
  const [ref] = useState({} as IModalRef);
  return ref;
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context)
    throw new Error('For useModal need Modal parrent!');

  return context;
};

export const ModalContext = createContext(null as TModalContext | null);
export const Modal: FC<IModal> = ({ children, ...props }) => {
  const [context] = useState(() =>
    makeSharedState(null as ReactElement | null)
  );

  const [elem, setElem] = context.useState();

  const {
    direction = 'bottom',
    fullscreen = false,
    modalRef = {}
  } = props;

  useEffect(() => {
    if (!modalRef) return;
    modalRef.current = context as any;
    return () => { modalRef.current = null as any; };
  });

  return (
    <ModalContext.Provider value={context as any}>
      {children}
      <If condition={elem}>
        <div className={'modal-component'} data-fullscreen={fullscreen}>
          <Outside onOutsideClick={() => setElem(null)}>
            <div data-direction={direction} className="modal-window">
              {elem}
            </div>
          </Outside>
        </div>
      </If>
    </ModalContext.Provider>
  );
};