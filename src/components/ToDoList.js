import { Container, Grid, Button } from "semantic-ui-react";
import { useState } from "react";

import TextareaAutosize from "react-textarea-autosize";

function ToDoList(props) {
  const [uploading, setUploading] = useState(false);
  const { mySky, todoData, setTodoData, filePath } = props;

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

export default ToDoList;
