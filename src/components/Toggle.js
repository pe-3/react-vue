import { forwardVue } from "../Vue";
import { ref } from 'vue';

const Toggle = forwardVue(
  // options 2.6
  {
    name: 'Toggle',
    data() {
      return {
        isOn: false,
      }
    },
    methods: {
      toggle() {
        this.isOn = !this.isOn;
      }
    },
  },
  (vm) => {
    const { isOn, toggle } = vm;
    return (
      <div ref={ref}>
        <button onClick={toggle}>
          {isOn ? '关' : '开'}
        </button>
      </div>
    );
  }
);

export default Toggle;