import { forwardRef } from "react";
import Vue from "./Vue";

const Template = forwardRef(({ vm }, ref) => {
  const { title, $refs, seeRefs, count, increment } = vm;
  return (
    <div ref={ref}>
      <span ref={$refs.set("top-title")}>{title}</span>
      <button
        onClick={() => {
          seeRefs();
        }}
        ref={$refs.set("top-btn")}
      >
        查看refs
      </button>
      <p ref={$refs.set('count-render')}>{ count }</p>
      <button onClick={increment}>increment</button>
    </div>
  );
});

const App = (props) => (
  <Vue
    name='App'
    props={props}
    defineProps={{
      title: String,
    }}
    data={() => ({
      count: 0
    })}
    methods={{
      seeRefs() {
        console.log(this.$refs, this.$el, this.$children);
      },
      increment() {
        this.count++;
      }
    }}
    onUpdated={(vm) => {
      console.log("updated", vm.$refs['count-render']);
    }}
  >
    <Template />
  </Vue>
);

export default App;
