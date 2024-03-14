import { forwardVue } from "../Vue";
import { ref } from 'vue';

const ItemList = forwardVue(
  {
    name: 'ItemList',
    setup(props) {
      const items = ref(['苹果', '香蕉', '橙子']);
      return {
        items
      };
    }
  },
  (vm) => {
    const { items } = vm;
    return (
      <div>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
);

export default ItemList;