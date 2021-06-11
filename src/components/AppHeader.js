import { Header } from "semantic-ui-react";
import LoginLogoutButton from "./LoginLogoutButton";

function AppHeader(props) {
  const { loggedIn, handleLogin, handleLogout } = props;
  return (
    <header className="App-header">
      <Header as="h1" inverted>
        Todo Tracker
      </Header>
      <div className="App-header-right">
        <LoginLogoutButton
          loggedIn={loggedIn}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  );
}

export default AppHeader;
