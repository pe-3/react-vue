import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const RenderApp = () => {
  return (
    <>
      <App />
    </>
  );
};

root.render(
  <RenderApp />   
);
