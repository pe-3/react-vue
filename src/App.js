import { forwardRef } from "react";
import Vue from "./Vue";
import MyInput, { MyInput2 } from "./components/MyInput";

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
      />
      <MyInput2
        title='这是你的吗，啊，宝子'
      />
      <MyInput2/>
    </div>
  );
});

export default App;
