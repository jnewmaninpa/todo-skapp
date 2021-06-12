import { SkynetClient } from "skynet-js";

const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;
const client = new SkynetClient(portal);

const dataDomain = window.location.hostname.split(".")[0];
export const filePath = dataDomain + "/ToDoFiles";

const loadingText = "Loading...";
const loadingCompleteText = "Loading complete!";
const errorLoadingText = "Error fetching data";
const uploadingText = "Uploading...";
const uploadingCompleteText = "Upload complete!";
const errorUploadingText = "Error with setJSON";

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
    if (loggedIn) {
      loadData({ ...props, mySky });
    }
  } catch (e) {
    console.error(e);
  }
};

export const loadData = async (props) => {
  const { mySky, setLoading, setTodoData } = props;
  try {
    console.log(loadingText);
    if (setLoading) {
      setLoading(true);
    }

    const { data } = await mySky.getJSON(filePath);
    if (data) {
      setTodoData(data);
    }
    console.log(loadingCompleteText);
    if (setLoading) {
      setLoading(false);
    }
  } catch (error) {
    console.error(`${errorLoadingText}: ${error.message}`);
  }
};

export const handleMySkyLogin = async (props) => {
  const { mySky, setLoggedIn } = props;
  const status = await mySky.requestLoginAccess();
  setLoggedIn(status);

  if (status) {
    loadData(props);
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
    console.log(uploadingText);
    await mySky.setJSON(filePath, todoData);
    console.log(uploadingCompleteText);
    setUploading(false);
  } catch (error) {
    console.error(`${errorUploadingText}: ${error.message}`);
  }
};
