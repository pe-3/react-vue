import { forwardRef } from "react";
import { reactive } from 'vue';
import Vue from "../Vue";

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
