<template>
  <div class="request-detail">
    <slot name="menu"></slot>
    <div class="stacks" v-for="(stack,idx) in allLayers" :key="idx">
      <parsing :data="stack" @click="handleClick" @pop="pop"></parsing>
    </div>
  </div>
</template>
<script>
import isJson from "is-json";
import Parsing from "./parsing";

export default {
  name: "RequestDetail",
  components: {
    Parsing
  },
  props: {
    content: {
      type: String
    }
  },
  data() {
    return {
      stacks: []
    };
  },
  computed: {
    allLayers() {
      return [
        {
          path: "root",
          value: this.content
        },
        ...this.stacks
      ];
    }
  },
  watch: {
    content() {
      this.stacks = [];
    }
  },
  methods: {
    handleClick(key, value) {
      if (typeof value !== "string") return;
      if (value.length < 20) return;
      if (!isJson(value)) return;
      this.stacks.push({
        path: `${key}>`,
        value
      });
    },
    pop() {
      if (this.stacks.length) {
        this.stacks.pop();
      } else {
        this.$emit("pop");
      }
    }
  }
};
</script>
<style scoped>
.request-detail {
  position: relative;
  height: 100%;
}
.stacks {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
  overflow: auto;
}
</style>
