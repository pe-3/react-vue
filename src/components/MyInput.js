import { forwardVue } from "../Vue";
import { ref } from 'vue';
import { inject } from "../Vue/provider";

const MyInput = forwardVue(
  // options 2.6 & 2.7
  {
    name: 'myInput',
    setup() {
      const input = ref('');
      const changeInput = (e) => {
        input.value = e.target.value;
      }
      const name = inject('name');

      return {
        name,
        input,
        changeInput
      }
    }
  },
  // template 
  ({ vm }, ref) => {
    const { input, changeInput, name } = vm

    return (
      <div ref={ref}>
        { name }
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
