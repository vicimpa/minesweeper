import "./Main.sass";

import React, { FC } from "react";

import { Center } from "components/Center";
import { Text } from "components/Text";
import { Button } from "components/Button";
import { createModalRef, Modal } from "components/Modal";
import { Menu, MenuItem } from "components/Menu/Menu";
import { Records } from "components/Records";
import { useSwitch } from "components/Switch";
import { Choose, Other, When } from "components/Choose";
import { helperMode } from "lib/minesweeper";

export const Main: FC = () => {
  const modalRef = createModalRef()
  const switchContext = useSwitch()
  const [isHelperMode, setHelper] = helperMode.useState()

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
      <Menu title="Выберите сложность" {...{ onSelect, onCancel }}>
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
          <Choose>
            <When condition={isHelperMode}>
              <Button onClick={() => setHelper(false)} fill secondary>
                Помощь в первом ходе (Выкл)
              </Button>
            </When>
            <Other>
              <Button onClick={() => setHelper(true)} fill white>
                Помощь в первом ходе (Вкл)
              </Button>
            </Other>
          </Choose>
          {/* <Button onClick={record} fill secondary>Рекорды</Button> */}
          <Button onClick={GITGUB} fill white>Github</Button>
        </Center>
      </Modal>
    </div>
  )
}