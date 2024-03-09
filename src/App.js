import { forwardRef } from "react";
import Vue from "./Vue";
import MyInput from "./components/MyInput";

const App = () => (
  <Vue
    name='App'
  >
    <Template />
  </Vue>
);

const Template = forwardRef((_, ref) => {
  return (
    <div ref={ref}>
      <MyInput
        placeholder='请输入你的名字'
        clearOnSubmit
      />
    </div>
  );
});

export default App;
