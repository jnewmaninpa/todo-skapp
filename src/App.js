import "./App.css";

import { useState, useEffect } from "react";

import AppHeader from "./components/AppHeader";
import AppBody from "./components/AppBody";
import {
  filePath,
  initMySky,
  handleMySkyLogin,
  handleMySkyLogout,
} from "./helpers/MySkyHelpers";

function App() {
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(false);

  // On initial run, start initialization of MySky
  useEffect(() => {
    initMySky(mySky, setMySky, setLoggedIn, setLoading, setTodoData);
  }, [mySky]);

  return (
    <div className="App">
      <AppHeader
        loggedIn={loggedIn}
        handleLogin={() => handleMySkyLogin(mySky, setLoggedIn, setTodoData)}
        handleLogout={() => handleMySkyLogout(mySky, setLoggedIn, setTodoData)}
      />
      <AppBody
        loggedIn={loggedIn}
        loading={loading}
        filePath={filePath}
        todoData={todoData}
        setTodoData={setTodoData}
        mySky={mySky}
      />
    </div>
  );
}

export default App;
