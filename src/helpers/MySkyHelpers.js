import { SkynetClient } from "skynet-js";

const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;
const client = new SkynetClient(portal);

const dataDomain = window.location.hostname.split(".")[0];
export const filePath = dataDomain + "/ToDoFiles";

export const initMySky = async (props) => {
  const { setMySky, setLoggedIn } = props;
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
    loadData({ ...props, mySky });
  } catch (e) {
    console.error(e);
  }
};

export const loadData = async (props) => {
  const { mySky, setLoading, setTodoData } = props;
  try {
    console.log("Loading data");
    if (setLoading) {
      setLoading(true);
    }

    const { data } = await mySky.getJSON(filePath);
    if (data) {
      setTodoData(data);
    }
    console.log("done loading");
    if (setLoading) {
      setLoading(false);
    }
  } catch (error) {
    console.error(`error fetching data: ${error.message}`);
  }
};

export const handleMySkyLogin = async (props) => {
  const { mySky, setLoggedIn, setTodoData } = props;
  const status = await mySky.requestLoginAccess();
  setLoggedIn(status);

  if (status) {
    loadData({ mySky, setTodoData });
  }
};

export const handleMySkyLogout = async (props) => {
  const { mySky, setLoggedIn, setTodoData } = props;
  await mySky.logout();
  setLoggedIn(false);
  setTodoData([]);
};

export const uploadToMySky = async (props) => {
  const { mySky, setUploading, todoData } = props;
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
