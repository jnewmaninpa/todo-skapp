import "./App.css";

import { useState, useEffect } from "react";

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
    /************************************************/
    /*        Step 3.3 Code goes here               */
    /************************************************/

    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }

    /*****/
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo</h1>
        <div className="App-header-right">
          <button onClick={handleMySkyLogin}>Login with MySky</button>
        </div>
      </header>
      <div className="App-body"></div>
    </div>
  );
}

export default App;
