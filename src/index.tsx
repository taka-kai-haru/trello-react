import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { Body } from "./Body";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    {/*<Body>*/}
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    {/*</Body>*/}
  </Provider>,
);
