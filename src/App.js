import Vue, { forwardVue } from "./Vue";
import { reactive } from "vue";

const App = forwardVue(
  {
    name: 'App',
    setup() {
      const state = reactive({
        count: 0,
        disabled: false
      });

      const increment = () => {
        state.count++;
        state.disabled = !state.disabled;
      }

      return {
        state,
        increment
      }
    }
  },
  (vm) => {
    const { state, increment } = vm;

    return (
      <div>
        <h1>{state.count}</h1>
        <button onClick={increment}>+</button>
      </div>
    );
  }
)

export default App;
