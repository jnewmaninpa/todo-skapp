import "./App.css";

import { Header, Message, Dimmer } from "semantic-ui-react";

import { useState, useEffect } from "react";

import { SkynetClient } from "skynet-js";

import LoginLogoutButton from "./components/LoginLogoutButton";
import ToDoList from "./components/ToDoList";

const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;
const client = new SkynetClient(portal);

function App() {
  const dataDomain = window.location.hostname.split(".")[0];
  const filePath = dataDomain + "/ToDoFiles";
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(false);

  // On initial run, start initialization of MySky
  useEffect(() => {
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          console.log("Loading data");
          setLoading(true);
          const { data } = await mySky.getJSON(filePath);
          if (data) {
            setTodoData(data);
          }
          console.log("done loading");
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();
  }, []);

  const handleMySkyLogin = async () => {
    const status = await mySky.requestLoginAccess();
    setLoggedIn(status);

    if (status) {
      // Try to load data if loggin successful
      try {
        const { data } = await mySky.getJSON(filePath);
        if (data) {
          setTodoData(data);
        }
      } catch (error) {
        console.error(`Error fetching data ${error.message}`);
      }
    }
  };

  const handleMySkyLogout = async () => {
    await mySky.logout();
    setLoggedIn(false);
    setTodoData([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Header as="h1" inverted>
          Todo Tracker
        </Header>
        <div className="App-header-right">
          <LoginLogoutButton
            loggedIn={loggedIn}
            handleLogin={handleMySkyLogin}
            handleLogout={handleMySkyLogout}
          />
        </div>
      </header>

      <div className="App-body" hidden={!loggedIn}>
        <Dimmer active={loading} page>
          <h1 hidden={!loading}>Loading</h1>
        </Dimmer>
        <ToDoList
          filePath={filePath}
          todoData={todoData}
          mySky={mySky}
          setTodoData={setTodoData}
        />
      </div>

      <Message hidden={loggedIn}>
        <Message.Header>Please Login</Message.Header>
        <p>
          Please login to continue... If you do not have an account you can make
          one for free.
        </p>
      </Message>
    </div>
  );
}

export default App;
