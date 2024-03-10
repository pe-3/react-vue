import { forwardRef } from "react";
import { reactive } from 'vue';
import Vue, { forwardVue } from "../Vue";

const MyInput = (props) => (
  <Vue
    name='MyInput'
    defineProps={{
      onChange: Function,
    }}
    props={props}
    setup={(props, { emit }) => {
      const state = reactive({
        input: ''
      });
      const changeInput = (e) => {
        state.input = e.target.value;
        emit('change', state.input);
      }

      return {
        state,
        changeInput
      }
    }}
  >
    <Template />
  </Vue>
);

const Template = forwardRef(({ vm }, ref) => {

  const {
    state,
    changeInput,
  } = vm;

  return (
    <div ref={ref}>
      <input
        value={state.input}
        onChange={changeInput}
      />
      { state.input }
    </div>
  );
});

export default MyInput;

export const MyInput2 = forwardVue(
  {
    name: 'myInput2',
    props: {
      title: String
    },
    data() {
      return {
        count: 0
      }
    },
    methods: {
      increment() {
        this.count++;
      },
      decrement() {
        this.count--;
      }
    },
  },
  ({ vm }, ref) => {
    const { count, increment, title, decrement } = vm

    return (
      <div ref={ref}>
        <h1>{ title }</h1>
        <p>{ count }</p>
        <button onClick={increment}>increment</button>
        <button onClick={decrement}>decrement</button>
      </div>
    )
  }
)