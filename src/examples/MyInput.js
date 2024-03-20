import { forwardVue } from "../Vue";
import { ref } from 'vue';

const MyInput = forwardVue(
  // options 2.7
  {
    name: 'myInput',
    setup() {
      const input = ref('');
      const changeInput = (e) => {
        input.value = e.target.value;
      }
      
      return {
        input,
        changeInput
      }
    }
  },
  // template 
  (vm) => {
    const { input, changeInput } = vm;
    return (
      <div>
        <input
          value={input}
          onChange={changeInput}
        />
        { input }
      </div>
    )
  }
)

export default MyInput;
