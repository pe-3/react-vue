import { forwardVue } from "./Vue";
import { provide } from './Vue/provider';

import MyInput from "./examples/MyInput";
import Counter from "./examples/Couter";
import ItemList from "./examples/ItemList";
import Toggle from "./examples/Toggle";
import UserInfo from "./examples/UserInfo";
import CheckboxGroup from "./examples/CheckboxGroup";

const App = forwardVue(
  {
    name: 'App',
    mounted() {
      console.log(this.$children);
      console.log(this.$refs);
    },
    setup() {
      provide('name', 'zhangsan');
    }
  },
  ({ $refs }) => {
    return (
      <div>
        <MyInput ref={$refs.set('my-input')}/>
        <Counter initcount={11} />
        <ItemList />
        <Toggle />
        <UserInfo />
        <CheckboxGroup />
      </div>
    );
  }
)

export default App;
