import { forwardRef } from "react";
import Vue from "./Vue";

const Template3 =  forwardRef(({ vm }, ref) => {
  const { seeRefs } = vm;

  return (
    <div ref={ref}>
      <span onClick={seeRefs}>这是 孩子 3</span>
    </div>
  );
})

const Child3  = () => (
  <Vue
    name='Child3'
    methods={{
      seeRefs() {
        console.log('root', this.$root.$el);
        console.log('parent', this.$parent.$el);
      },
    }}
  >
    <Template3 />
  </Vue>
)

const Template1 =  forwardRef(({ vm }, ref) => {
  const { seeRefs } = vm;

  return (
    <div ref={ref}>
      <span onClick={seeRefs}>这是 孩子 1</span>
      <Child3 />
    </div>
  );
})

const Child1  = () => (
  <Vue
    name='Child1'
    methods={{
      seeRefs() {
        console.log(this.$root.$el);
        console.log(this.$parent.$el);
      },
    }}
  >
    <Template1 />
  </Vue>
)

const Template2 = forwardRef(({ vm }, ref) => {
  const { seeRefs } = vm;

  return (
    <div ref={ref}>
      <span onClick={seeRefs}>这是 孩子 2</span>
      <Child1 />
    </div>
  );
})

const Child2 = () => (
  <Vue
    name='Child2'
    methods={{
      seeRefs() {
        console.log(this.$parent.$el);
        console.log(this.$children);
      },
    }}
  >
    <Template2 />
  </Vue>
)

const Template = forwardRef(({ vm }, ref) => {
  const { title, $refs, seeRefs } = vm;

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
      <Child2 />
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
    methods={{
      seeRefs() {
        this.$children?.forEach((child) => console.log(child.$el));
      },
    }}
    onMounted={(vm) => {
      console.log('我滴 app 挂载了', vm.$el);
    }}
    onUpdated={(vm) => {
      console.log('我滴 app 更新了', vm.$el);
    }}
  >
    <Template />
  </Vue>
);

export default App;
