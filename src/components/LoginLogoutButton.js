import { Button } from "semantic-ui-react";

const loginText = "Login with MySky";
const logoutText = "Logout";

function LoginLogoutButton(props) {
  const { loggedIn, handleLogin, handleLogout } = props;
  if (loggedIn) {
    return <Button onClick={handleLogout}>{logoutText}</Button>;
  } else {
    return <Button onClick={handleLogin}>{loginText}</Button>;
  }
}

export default LoginLogoutButton;
