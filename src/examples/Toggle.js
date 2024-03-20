import Vue, { forwardVue } from "../Vue";
import { ref } from 'vue';

const { If, Else, ElseIf } = Vue;

const Toggle = forwardVue(
  // options 2.6
  {
    name: 'Toggle',
    data() {
      return {
        isOn: false,
        isTransition: false
      }
    },
    methods: {
      toggle() {
        this.isOn = !this.isOn;
        this.isTransition = true;
        setTimeout(() => {
          this.isTransition = false;
        }, 1000);
      }
    },
  },
  (vm) => {
    const { isOn, toggle, isTransition } = vm;
    return (
      <div>
        <button onClick={toggle} disabled={isTransition}>
          {isOn ? '关' : '开'}
        </button>
        <If when={isTransition}>
          {/* 过渡中 */}
          <div>过渡中。。。</div>
        </If>
        <ElseIf when={isOn}>
          <div style={{ background: '#fff', height: '200px', border: '1px solid black' }}>
            灯开了，非常亮
          </div>
        </ElseIf>
        <Else>
          <div style={{ background: '#000', height: '200px', color: 'wheat' }}>
            灯关了，黑漆漆
          </div>
        </Else>
      </div>
    );
  }
);

export default Toggle;