import React from "react";
import ReactDOM from "react-dom";
import Provider from "./Provider";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Provider />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
