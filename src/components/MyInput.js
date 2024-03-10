import { forwardVue } from "../Vue";
import { ref } from 'vue';
import { inject } from "../Vue/provider";

const MyInput = forwardVue(
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
    },
  },
  ({ vm }, ref) => {
    const { count, increment, title } = vm

    return (
      <div ref={ref}>
        <h1>{ title }</h1>
        <p>{ count }</p>
        <button onClick={increment}>increment</button>
      </div>
    )
  }
)