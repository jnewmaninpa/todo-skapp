import { Button } from "semantic-ui-react";

function LoginLogoutButton(props) {
  const { loggedIn, handleLogin, handleLogout } = props;
  if (loggedIn) {
    return <Button onClick={handleLogout}>Logout</Button>;
  } else {
    return <Button onClick={handleLogin}>Login with MySky</Button>;
  }
}

export default LoginLogoutButton;
