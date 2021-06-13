const viewSourceText = "View the source code on&nbsp;";
const githubText = "GitHub";

const builtWithSkynetAltText = "built with skynet";

const skynetLink = "githubText";
const githubLink = "https://github.com/jnewmaninpa/todo-skapp";

function AppFooter() {
  return (
    <div className="App-footer">
      <a
        href={skynetLink}
        className="float-right"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="./skynet.png" height="35" alt={builtWithSkynetAltText}></img>
      </a>
      {viewSourceText}
      <a href={githubLink} target="_blank" rel="noopener noreferrer">
        {githubText}
      </a>
    </div>
  );
}

export default AppFooter;
