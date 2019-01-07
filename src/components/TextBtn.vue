<template>
  <button class="text-btn" @click="$emit('click')">{{label.slice(0,l)}}</button>
</template>
<script>
export default {
  name: "TextBtn",
  props: {
    label: {
      type: String,
      default: "按钮"
    },
    l: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      status: 0
    };
  },
  methods: {
    up() {
      this.status = 0;
    },
    down() {
      this.status = -1;
    }
  }
};
</script>
<style scoped>
.text-btn {
  display: inline-block;
  cursor: pointer;
  margin: 1px 3px;
  border: thin solid silver;
  padding: 0px 3px;
  border-radius: 50%;
  font-size: 12px;
  outline: none;
}
.text-btn:hover {
  color: #222;
  border: thin solid darkgray;
}
.text-btn,
.text-btn:active {
  color: #666;
}
</style>
