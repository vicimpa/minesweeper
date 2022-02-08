import { Center } from "components/Center";
import { Game } from "components/Game";
import { Main } from "components/Main";
import { Route, Switch } from "components/Switch";
import { render } from "react-dom";

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
), document.getElementById('app'));