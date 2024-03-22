import { forwardVue } from "../Vue";
import { ref } from 'vue';

const ItemList = forwardVue(
  {
    name: 'ItemList',
    data() {
      return {
        items: ['苹果', '香蕉', '橙子']
      }
    },
    mounted() {
      console.log(this.$root.$el, 'ItemList mounted');
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