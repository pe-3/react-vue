import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const RenderApp = () => {
  return (
    <>
      <App
        onChange={(e) => {
          console.log("改变了", e);
        }}
        title={"这是一个 title, can you see me????"}
        onAdd={() => {
          console.log("添加了");
        }}
      />
    </>
  );
};

root.render(
  <RenderApp />   
);
