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
    <div v-for="(item,idx) in items" :key="idx">
      <div class="title" :class="item.title">{{item.title.startsWith('request') ? '请求':'响应'}}</div>
      <pre v-if="isRaw(item.value)">{{ item.value }}</pre>
      <vue-json-pretty
        v-else
        :showLength="true"
        :deep="deep"
        selectableType="tree"
        :data="objData(item.value)"
        :path="path"
        @click="click"
      ></vue-json-pretty>
    </div>
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
  props: {
    data: {
      type: [Object, String]
    }
  },
  data() {
    return {
      deep: 4
    };
  },
  computed: {
    path() {
      return this.data.path;
    },
    items() {
      if (typeof this.data.value === "string") {
        return [{ title: "", value: this.data.value }];
      } else {
        return Object.entries(this.data.value)
          .filter(([_, value]) => !!value)
          .map(([title, value]) => {
            return { title, value };
          });
      }
    }
  },
  mounted() {
    console.info("a", this);
  },
  methods: {
    click(...payload) {
      this.$emit("click", ...payload);
    },
    isRaw(value) {
      return !isJson(value);
    },
    objData(value) {
      if (isJson(value)) {
        return JSON.parse(value);
      }
      return value;
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
.title {
  font-size: 1.5em;
}
.requestText {
  color: rgb(199, 13, 41);
}
.responseText {
  color: darkgreen;
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
