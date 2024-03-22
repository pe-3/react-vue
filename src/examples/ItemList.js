import { forwardVue } from "../Vue";

const ItemList = forwardVue(
  {
    name: 'ItemList',
    data() {
      return {
        items: ['苹果', '香蕉', '橙子'],
        text: ''
      }
    },
    mounted() {
      console.log(this.$root.$el, 'ItemList mounted');
    },
    props: {
      count: Number
    }
  },
  (vm) => {
    const { items, count } = vm;
    return (
      <div>
        {count}
        <input value={vm.text} onChange={(e) => { vm.text = e.target.value }} />
        {vm.text}
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