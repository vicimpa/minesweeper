
import "index.sass";

import React from "react";
import { render } from "react-dom";

import { Center } from "components/Center";
import { Main } from "components/Main";
import { Route, Switch } from "components/Switch";
import { Game } from "components/Game/Game";

render((
  <Center>
    <Switch>
      <Route route="main">
        <Main />
      </Route>

      <Route route="easy">
        <Game />
      </Route>

      <Route route="medium">
        <Game difficulty="medium" />
      </Route>

      <Route route="hard">
        <Game difficulty="hard" />
      </Route>
    </Switch>
  </Center>
), document.getElementById('app'))