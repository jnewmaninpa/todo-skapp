import "./App.css";

import {
  Button,
  Header,
  Grid,
  Message,
  Container,
  Dimmer,
} from "semantic-ui-react";

import TextareaAutosize from "react-textarea-autosize";

import { useState, useEffect } from "react";

import { SkynetClient } from "skynet-js";

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
  const [uploading, setUploading] = useState(false);

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

  function LogginLogoutButton() {
    if (loggedIn) {
      return <Button onClick={handleMySkyLogout}>Logout</Button>;
    } else {
      return <Button onClick={handleMySkyLogin}>Login with MySky</Button>;
    }
  }

  function ToDoList() {
    return (
      <Container className="App-grid-container">
        <Grid centered>
          {todoData.map((item, index) => {
            return <ToDoItem key={index} index={index} />;
          })}
          <Grid.Row>
            <Grid.Column mobile={16}>
              <Button primary onClick={deleteSelected}>
                Delete Selected
              </Button>
              <Button primary onClick={addTodo}>
                Add Todo
              </Button>
              <Button
                floated="right"
                onClick={uploadToMySky}
                disabled={uploading}
                loading={uploading}
                primary
              >
                {uploading ? "Uploading" : "Save Changes to MySky"}
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  function ToDoItem(props) {
    const { index } = props;
    return (
      <Grid.Row columns={16} stretched>
        <Grid.Column mobile={3} tablet={2} computer={1}>
          <input
            type="checkbox"
            checked={todoData[index].done}
            onChange={(e) => {
              todoData[index].done = e.target.checked;
              setTodoData(new Array(...todoData));
            }}
          />
        </Grid.Column>
        <Grid.Column mobile={13} tablet={14} computer={15}>
          <TextareaAutosize
            defaultValue={todoData[index].title}
            onChange={(e) => (todoData[index].title = e.target.value)}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }

  const addTodo = function () {
    if (todoData) {
      const temp = new Array(...todoData);
      temp.push({ done: false, title: "" });
      setTodoData(temp);
      console.log(temp);
    } else {
      setTodoData(new Array({ done: false, title: "" }));
    }
  };

  function deleteSelected() {
    setTodoData(todoData.filter((e) => !e.done));
  }

  const uploadToMySky = async () => {
    try {
      setUploading(true);
      console.log("Uploading...");
      await mySky.setJSON(filePath, todoData);
      console.log("Upload complete!");
      setUploading(false);
    } catch (error) {
      console.error(`error with setJSON: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Header as="h1" inverted>
          Todo Tracker
        </Header>
        <div className="App-header-right">
          <LogginLogoutButton />
        </div>
      </header>

      <div className="App-body" hidden={!loggedIn}>
        <Dimmer active={loading} page>
          <h1 hidden={!loading}>Loading</h1>
        </Dimmer>
        <ToDoList />
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
