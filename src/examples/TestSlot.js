import Vue, { forwardVue } from "../Vue";

export default forwardVue(
  {
    name: "TestSlot",
    setup() {
      return {
        name: "zhangsan",
      };
    },
  },
  () => {
    return (
      <div>
        <h1>test slot</h1>
        <Vue.slot>default children</Vue.slot>
      </div>        
    );  
  }
)