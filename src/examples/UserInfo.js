import { forwardVue } from "../Vue";
import { ref } from 'vue';

const UserInfo = forwardVue(
  {
    name: 'UserInfo',
    setup() {
      const name = ref('');
      const email = ref('');
      
      // 当 setup 返回之后，ref 会解析到 vm 上，因此不再需要.value
      return {
        name,
        email
      };
    }
  },
  (vm) => {
    return (
      <div ref={ref}>
        <input
          placeholder="姓名"
          value={vm.name}
          onChange={(e) => vm.name = e.target.value }
        />
        <input
          placeholder="邮箱"
          value={vm.email}
          onChange={(e) => vm.email = e.target.value }
        />
        <p>姓名: {vm.name}</p>
        <p>邮箱: {vm.email}</p>
      </div>
    );
  }
);

export default UserInfo;