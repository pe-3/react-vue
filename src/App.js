import Vue, { forwardVue } from "./Vue";
import { provide } from './Vue/provider';

import MyInput from "./examples/MyInput";
import Counter from "./examples/Couter";
import ItemList from "./examples/ItemList";
import Toggle from "./examples/Toggle";
import UserInfo from "./examples/UserInfo";
import CheckboxGroup from "./examples/CheckboxGroup";
import TestSlot from './examples/TestSlot';

const App = forwardVue(
  {
    name: 'App',
    mounted() {
    },
    data() {
      return {
        count: 0
      }
    },
    setup() {
      provide('name', 'zhangsan');
    },
    methods: {
      increment() {
        this.count ++;
      },
      decrement() {
        this.count --;
      }
    },
    mounted() {
      console.log(this.$option.name, 'mounted', 'saxsaxasx');
    }
  },
  (vm) => {
    const { count, increment } = vm;

    return (
      <div>
        <button onClick={increment}>+</button>
        <span>{ count }</span>
        <ItemList />
        <Counter />
        <TestSlot>
          这是默认内容
        </TestSlot>
      </div>
    );
  }
)

export default App;
