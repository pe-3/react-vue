export default function Refs() {
  return {
    set(key) {
      return (ref) => {
        this[key] = ref;
      };
    },
  };
}
