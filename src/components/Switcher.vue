<template>
  <label class="switcher">
    <input type="checkbox" v-model="data">
    {{ label }}
  </label>
</template>
<script>
export default {
  name: "Switcher",
  props: {
    value: null,
    label: {
      type: String,
      default: ""
    }
  },
  computed: {
    data: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>
<style scoped>
.switcher {
  display: inline-block;
  cursor: pointer;
  margin: 1px 3px;
  border: thin solid silver;
  padding: 2px;
  border-radius: 2px;
  color: #666;
  font-size: 12px;
}
input {
  outline: none;
}
</style>
