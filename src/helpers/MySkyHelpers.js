import { SkynetClient } from "skynet-js";

const portal =
  window.location.hostname === "localhost" ? "https://siasky.net" : undefined;
const client = new SkynetClient(portal);
const dataDomain = window.location.hostname.split(".")[0];
export const filePath = dataDomain + "/ToDoFiles";

export async function initMySky(
  mySky,
  setMySky,
  setLoggedIn,
  setLoading,
  setTodoData
) {
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
    loadData(mySky, setLoading, setTodoData);
  } catch (e) {
    console.error(e);
  }
}

export async function loadData(mySky, setLoading, setTodoData) {
  try {
    console.log("Loading data");
    setLoading(true);
    const { data } = await mySky.getJSON(filePath);
    if (data) {
      setTodoData(data);
    }
    console.log("done loading");
    setLoading(false);
  } catch (error) {
    console.error(`error fetching data: ${error.message}`);
  }
}

export const handleMySkyLogin = async (mySky, setLoggedIn, setTodoData) => {
  const status = await mySky.requestLoginAccess();
  setLoggedIn(status);

  if (status) {
    loadData(mySky, () => null, setTodoData);
  }
};

export const handleMySkyLogout = async (mySky, setLoggedIn, setTodoData) => {
  await mySky.logout();
  setLoggedIn(false);
  setTodoData([]);
};
