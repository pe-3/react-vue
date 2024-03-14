import { forwardVue } from "./Vue";
import { provide } from './Vue/provider';

import MyInput from "./components/MyInput";
import Counter from "./components/Couter";
import ItemList from "./components/ItemList";
import Toggle from "./components/Toggle";
import UserInfo from "./components/UserInfo";
import CheckboxGroup from "./components/CheckboxGroup";

const App = forwardVue(
  {
    name: 'App',
    mounted() {
      console.log(this.$children);
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
