import "./App.css";

import { useState, useEffect, Component } from "react";

import { Skynet, SkynetClient } from "skynet-js";
import { ContentRecordDAC } from "@skynetlabs/content-record-library";

const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;
const client = new SkynetClient(portal);
const contentRecord = new ContentRecordDAC();

function App() {
  const [dataKey, setDataKey] = useState("");
  const [mySky, setMySky] = useState();
  const [userID, setUserID] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [filePath, setFilePath] = useState();
  const [todoData, setTodoData] = useState([]);

  // When dataKey changes, update FilePath state.
  useEffect(() => {
    setFilePath(dataDomain + "/" + dataKey);
  }, [dataKey]);

  const dataDomain = window.location.hostname.split(".")[0];

  // On initial run, start initialization of MySky
  useEffect(() => {
    // define async setup function
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);

        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        // check if user is already logged in with permissions
        const loggedIn = await mySky.checkLogin();

        // set react state for login status and
        // to access mySky in rest of app
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();

    /*****/
  }, []);

  const handleMySkyLogin = async () => {
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };

  const handleMySkyLogout = async () => {
    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID("");
  };

  function LogginLogoutButton() {
    if (loggedIn) {
      return <button onClick={handleMySkyLogout}>Logout</button>;
    } else {
      return <button onClick={handleMySkyLogin}>Login with MySky</button>;
    }
  }

  function ToDoList() {
    return (
      <table>
        <tbody>
          {todoData.map((item, index) => {
            return <ToDoItem key={index} index={index} />;
          })}
        </tbody>
      </table>
    );
  }

  function ToDoItem(props) {
    return (
      <tr>
        <td className="checkBoxCell">
          <input
            type="checkbox"
            checked={todoData[props.index].done}
            onChange={(e) => {
              todoData[props.index].done = e.target.checked;
              setTodoData(new Array(...todoData));
            }}
          />
        </td>
        <td>
          <textarea
            defaultValue={todoData[props.index].title}
            onChange={(e) => (todoData[props.index].title = e.target.value)}
          />
        </td>
      </tr>
    );
  }

  const addRow = function () {
    if (todoData) {
      const temp = new Array(...todoData);
      temp.push({ done: false, title: "" });
      setTodoData(temp);
      console.log(temp);
    } else {
      setTodoData(new Array({ done: false, title: "" }));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo</h1>
        <div className="App-header-right">
          <LogginLogoutButton />
        </div>
      </header>
      <div className="App-body">
        <ToDoList />
        <button className="tableActionButtons">Delete Selected</button>
        <button className="tableActionButtons" onClick={addRow}>
          Add Row
        </button>
        <button className="tableActionButtons">Save Changes to MySky</button>
      </div>
    </div>
  );
}

export default App;
