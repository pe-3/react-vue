import { forwardVue } from "./Vue";
import MyInput, { MyInput2 } from "./components/MyInput";
import { provide, inject } from './Vue/provider'

const App = forwardVue(
  {
    name: 'App',
    mounted() {
      console.log(this.$el);
    },
    setup() {
      provide('name', 'zhangsan');
    }
  },
  (_, ref) => {
    return (
      <div ref={ref}>
        <MyInput
          placeholder='请输入你的名字'
        />
      </div>
    );
  }
)

export default App;
