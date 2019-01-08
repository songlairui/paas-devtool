<template>
  <div class="layer">
    <div class="fixed">
      <text-btn label="关闭" @click="$emit('pop')"></text-btn>展开层级:
      <text-btn label="-" @click="deep-=1"></text-btn>
      <input type="number" min="0" max="100" v-model.number="deep">
      <text-btn label="+" @click="deep+=1"></text-btn>
      展开层级:
      解析路径: {{ path }}
    </div>
    <pre v-if="isRaw">{{ data.value }}</pre>
    <vue-json-pretty
      v-else
      :showLength="true"
      :deep="deep"
      selectableType="tree"
      :data="objData"
      :path="path"
      @click="click"
    ></vue-json-pretty>
  </div>
</template>
<script>
import isJson from "is-json";
import VueJsonPretty from "vue-json-pretty";

export default {
  name: "content",
  components: {
    VueJsonPretty
  },
  props: ["data"],
  data() {
    return {
      deep: 4
    };
  },
  computed: {
    path() {
      return this.data.path;
    },
    isRaw() {
      return !isJson(this.data.value);
    },
    objData() {
      if (this.isRaw) return this.data.value;
      return JSON.parse(this.data.value);
    }
  },
  methods: {
    click(...payload) {
      this.$emit("click", ...payload);
    }
  }
};
</script>
<style scoped>
.layer {
  padding-top: 30px;
}
.fixed {
  top: 28px;
  position: fixed;
  left: 50%;
  z-index: 999;
  width: 50%;
  background: #fff;
  opacity: 0.9;
}
</style>
<style>
.vjs__tree {
  font-size: 12px;
}
.vjs__tree .vjs__value__string {
  color: darkgreen;
  word-break: break-all;
}
</style>
