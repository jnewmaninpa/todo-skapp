import { Message, Dimmer } from "semantic-ui-react";

import ToDoList from "./ToDoList";

const loadingText = "Loading";
const loginMessageHeaderText = "Please Login";
const loginMessageBodyText =
  "Please login to continue... If you do not have an account you can make one for free.";

function AppBody(props) {
  const { loggedIn, loading, todoData, setTodoData, mySky } = props;
  return (
    <>
      <div className="App-body" hidden={!loggedIn}>
        <Dimmer active={loading} page>
          <h1 hidden={!loading}>{loadingText}</h1>
        </Dimmer>
        <ToDoList todoData={todoData} mySky={mySky} setTodoData={setTodoData} />
      </div>

      <Message hidden={loggedIn}>
        <Message.Header>{loginMessageHeaderText}</Message.Header>
        <p>{loginMessageBodyText}</p>
      </Message>
    </>
  );
}

export default AppBody;
