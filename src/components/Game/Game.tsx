import "./Game.sass";

import { Button } from "components/Button";
import { Choose, Other, When } from "components/Choose";
import { For } from "components/For";
import { If } from "components/If";
import { useSwitch } from "components/Switch/Switch";
import { Text } from "components/Text";
import { DEVMODE, GITGUB } from "config";
import { MineSweeper } from "lib/minesweeper";
import { useEvent } from "lib/useEvent";
import { createRef, FC, MouseEventHandler, useEffect, useRef, useState } from "react";

interface IItem {
  x: number;
  y: number;
  v: number;
  game: MineSweeper;
}

interface ITimer {
  game: MineSweeper;
}

interface IGame {
  difficulty?: keyof typeof difficultyStore;
}

const p = 50;

export const difficultyStore = {
  easy: [10, 8, 10],
  medium: [18, 14, 40],
  hard: [24, 20, 99]
};

export const Item: FC<IItem> = ({ x, y, v, game }) => {
  const open: MouseEventHandler = (e) => {
    if (!game.isFlag(x, y))
      game.setOpen(x, y);
  };

  const flag: MouseEventHandler = (e) => {
    game.toggleFlag(x, y);
  };

  const chordClick: MouseEventHandler = (e) => {
    game.chordClick(x, y);
  };

  return (
    <div className={'item'}>
      <Choose>
        <When condition={game.isOpen(x, y)}>
          <Choose>
            <When condition={v == -1}>
              <i data-bomb />
            </When>
            <When condition={v}>
              <i onClick={chordClick} data-number={v}>{v}</i>
            </When>
          </Choose>
        </When>
        <Other>
          <b
            onClick={open}
            onContextMenu={flag}
            data-null={game.devMode && v == 0}
            data-bomb={game.devMode && v == -1}
            data-flag={game.isFlag(x, y)} />
        </Other>
      </Choose>
    </div>
  );
};

export const Timer: FC<ITimer> = ({ game }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (game.startTime == -1 || game.stopTime != -1 || !game.started) {
      setTime(0);
      return;
    }


    const interval = setInterval(() => {
      setTime(performance.now() - game.startTime);
    }, 10);

    return () => clearInterval(interval);
  }, [game.startTime, game.stopTime, game.started]);

  return (
    <Button center disabled white>
      Time: {game.timeString}
    </Button>
  );
};

export const Game: FC<IGame> = (props) => {
  const {
    difficulty = 'easy'
  } = props;

  const ref = useRef<HTMLDivElement>();

  const switchContext = useSwitch();
  const [width, height, length] = difficultyStore[difficulty];
  const game = MineSweeper.make(width, height, length);

  game.use();

  useEvent(ref as any, 'click', (e) =>
    e.preventDefault());

  useEvent(ref as any, 'contextmenu', (e) =>
    e.preventDefault());

  const start = () => game.start();
  const newGame = () => game.newGame();
  const exit = () => switchContext('main');

  const resize = () => {
    if (!ref.current)
      return;

    const element = ref.current;
    const parent = element.parentElement;

    const { offsetWidth: w, offsetHeight: h } = element!;
    const { offsetWidth: W, offsetHeight: H } = parent!;

    const scale = Math.min((W - p) / w, (H - p) / h);

    element.style.transform = `scale(${scale})`;
    element.style.opacity = '1';
  };

  useEvent('resize', (e) => {
    resize();
  });

  useEffect(() => {
    resize();
  }, []);

  return (
    <div className={'game-component'}>
      <If condition={!game.started}>
        <div className={'game-start'}>
          <div className={'game-window'}>
            <Choose>
              <When condition={game.state == 0}>
                <Text h2>Начало новой игры</Text>
                <Text left h6>Размеры {game.width}x{game.height}</Text>
                <Text left h6>Бомб {game.length}</Text>
                <Button onClick={start}>
                  Запустить
                </Button>
              </When>
              <When condition={game.state == 1}>
                <Text h2>Вы проиграли</Text>
                <Text left h6>Открыто ячеек {game.opensCount}</Text>
                <Text left h6>Установлено флагов {game.flugsCount}</Text>
                <Text left h6>Время игры {game.timeString}</Text>
                <Button center onClick={newGame}>
                  Попробовать еще
                </Button>
              </When>
              <When condition={game.state == 2}>
                <Text h2>Вы выиграли</Text>
                <Text left h6>Время игры {game.timeString}</Text>
                <Button center onClick={newGame}>
                  Начать новую игру
                </Button>
              </When>
            </Choose>
            <Button secondary onClick={exit}>
              Выйти
            </Button>
            <Button onClick={() => window.open(GITGUB)} fill white>Github</Button>
          </div>

        </div>
      </If>
      <div className={'game-header'}>
        <Button center onClick={newGame}>
          Новая игра
        </Button>

        <div className={'panel'}>
          <Button center disabled white>❌ {game.flugsCount}/{game.length}</Button>
          <Timer game={game} />
        </div>

        <If condition={DEVMODE}>
          <Button
            center
            color={game.devMode ? 'primary' : 'white'}
            onClick={() => game.toggleDevMode()}
          >
            <Choose>
              <When condition={game.devMode}>
                Dev (Выкл)
              </When>
              <Other>
                Dev (Вкл)
              </Other>
            </Choose>
          </Button>
        </If>

        <Button center secondary onClick={exit}>
          Меню
        </Button>
      </div>
      <div className={'game-content'}>
        <div ref={ref as any} className={'display'}>
          <For of={game.rows()}>
            {row => (
              <div className={'row'}>
                <For of={row.items()}>
                  {([x, y, v]) => (
                    <Item x={x} y={y} v={v} game={game} />
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};