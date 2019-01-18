<template>
  <div class="request-detail">
    <slot name="menu"></slot>
    <div class="stacks" v-for="(stack,idx) in allLayers" :key="idx">
      <parsing :data="stack" @click="handleClick" @pop="pop"></parsing>
    </div>
    <div class="loading" v-if="loading">{{ info }}</div>
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
    detail: {
      type: Object,
      default: () => ({
        requestText: "",
        responseText: ""
      })
    }
  },
  data() {
    return {
      stacks: [],
      loading: false,
      info: ""
    };
  },
  computed: {
    allLayers() {
      return [
        {
          path: "root",
          value: this.detail
        },
        ...this.stacks
      ];
    }
  },
  watch: {
    detail() {
      this.stacks = [];
    }
  },
  methods: {
    async handleClick(key, value) {
      if (typeof value !== "string") return;
      if (value.length < 20) return;
      if (!isJson(value)) return;
      try {
        this.loading = true;
        this.info = "解析中 ...";
        await new Promise(r => setTimeout(r, 17));
        this.stacks.push({
          path: `${key}>`,
          value
        });
        await new Promise(r => setTimeout(r, 1));
      } catch (error) {}
      this.loading = false;
      this.info = "";
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
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.6);
  color: #333;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
