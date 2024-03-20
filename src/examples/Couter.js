import { forwardVue } from "../Vue";
import { ref } from 'vue';

const Counter = forwardVue(
  {
    name: 'Counter',
    props: {
      initcount: Number
    },
    setup({ initcount }) {
      const count = ref(initcount || 0);
      const increment = () => {
        count.value++;
      };
      
      return {
        count,
        increment
      };
    }
  },
  (vm) => {
    const { count, increment } = vm;
    return (
      <div>
        <button onClick={increment}>
          加 1
        </button>
        <p>计数: {count}</p>
      </div>
    );
  }
);

export default Counter;