import "./App.css";

import { useState, useEffect } from "react";

import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import AppBody from "./components/AppBody";
import { initMySky } from "./helpers/MySkyHelpers";

function App() {
  const [mySky, setMySky] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(false);

  // On initial run, start initialization of MySky
  useEffect(() => {
    initMySky({ setMySky, setLoggedIn, setLoading, setTodoData });
  }, []);

  return (
    <div className="App">
      <AppHeader
        loggedIn={loggedIn}
        mySky={mySky}
        setLoading={setLoading}
        setLoggedIn={setLoggedIn}
        setTodoData={setTodoData}
      />
      <AppBody
        loggedIn={loggedIn}
        loading={loading}
        todoData={todoData}
        setTodoData={setTodoData}
        mySky={mySky}
      />
      <AppFooter />
    </div>
  );
}

export default App;
