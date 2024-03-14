import { forwardVue } from "../Vue";
import { reactive } from 'vue';

const CheckboxGroup = forwardVue(
  {
    name: 'CheckboxGroup',
    setup() {
      const selectedOptions = reactive([]);

      // 更新数组内容的函数
      const toggleOption = (option) => {
        const index = selectedOptions.indexOf(option);
        if (index > -1) {
          selectedOptions.splice(index, 1);
        } else {
          selectedOptions.push(option);
        }
      };

      return {
        selectedOptions,
        toggleOption
      };
    }
  },
  (vm) => {
    const options = ['Option A', 'Option B', 'Option C'];
    return (
      <div>
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={vm.selectedOptions.includes(option)}
              onChange={() => vm.toggleOption(option)}
            />
            {option}
          </label>
        ))}
      </div>
    );
  }
);

export default CheckboxGroup;