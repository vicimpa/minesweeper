import "./Main.sass";

import React, { FC } from "react";

import { Center } from "components/Center";
import { Text } from "components/Text";
import { Button } from "components/Button";
import { createModalRef, Modal } from "components/Modal";
import { Menu, MenuItem } from "components/Menu/Menu";
import { Records } from "components/Records";
import { useSwitch } from "components/Switch";

export const Main: FC = () => {
  const modalRef = createModalRef()
  const switchContext = useSwitch()

  const record = () => {
    modalRef?.current?.setState(
      <Records />
    )
  }

  const onSelect = (v) => {
    switchContext(v)
    modalRef?.current?.setState(null)
  }

  const onCancel = () => {
    modalRef?.current?.setState(null)
  }

  const click = () => {
    modalRef.current?.setState(
      <Menu title="Выберите сложность" {...{onSelect, onCancel}}>
        <MenuItem value="easy">Легкий</MenuItem>
        <MenuItem value="medium">Средний</MenuItem>
        <MenuItem value="hard">Сложный</MenuItem>
        <MenuItem cancel>Отмена</MenuItem>
      </Menu>
    )
  }

  return (
    <div className={'main-component'}>
      <Modal modalRef={modalRef}>
        <Center direction="column">
          <Text h1>Сапёр</Text>
          <Button onClick={click} fill primary>Начать</Button>
          {/* <Button onClick={record} fill secondary>Рекорды</Button> */}
          <Button onClick={GITGUB} fill white>Github</Button>
        </Center>
      </Modal>
    </div>
  )
}