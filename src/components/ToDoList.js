import { Container, Grid, Button } from "semantic-ui-react";
import { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";

import { uploadToMySky } from "../helpers/MySkyHelpers";

function ToDoList(props) {
  const [uploading, setUploading] = useState(false);
  const { todoData, setTodoData } = props;

  const addTodo = () => {
    if (todoData) {
      setTodoData([...todoData, { done: false, title: "" }]);
    } else {
      setTodoData([{ done: false, title: "" }]);
    }
  };

  const deleteSelected = () => {
    setTodoData(todoData.filter((e) => !e.done));
  };

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

  return (
    <Container className="App-grid-container">
      <Grid centered>
        {todoData.map((_, index) => {
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
              onClick={() => uploadToMySky({ ...props, setUploading })}
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

export default ToDoList;
