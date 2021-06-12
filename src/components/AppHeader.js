import { Header } from "semantic-ui-react";
import LoginLogoutButton from "./LoginLogoutButton";
import { handleMySkyLogin, handleMySkyLogout } from "../helpers/MySkyHelpers";

function AppHeader(props) {
  const { loggedIn } = props;
  return (
    <header className="App-header">
      <Header as="h1" inverted>
        Todo Tracker
      </Header>
      <div className="App-header-right">
        <LoginLogoutButton
          loggedIn={loggedIn}
          handleLogin={() => handleMySkyLogin(props)}
          handleLogout={() => handleMySkyLogout(props)}
        />
      </div>
    </header>
  );
}

export default AppHeader;
