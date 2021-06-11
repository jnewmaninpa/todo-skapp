import { Message, Dimmer } from "semantic-ui-react";

import ToDoList from "./ToDoList";

function AppBody(props) {
  const { loggedIn, loading, filePath, todoData, setTodoData, mySky } = props;
  return (
    <>
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
    </>
  );
}

export default AppBody;
