<template>
  <div class="panel">
    <div class="left">
      <h1>{{title}}</h1>
      <ul>
        <li
          :class="{curr:idx ===currentIdx}"
          v-for="(item, idx) in lists"
          :key="idx"
          @click="select(idx)"
        >
          {{ item.freeze.res.startedDateTime | localeTime }}
          {{ item.freeze.res.request.url }}
        </li>
      </ul>
    </div>
    <div class="right" v-if="right">
      <span class="close" @click="unSelect">x</span>
      {{currentVal}}
    </div>
  </div>
</template>
<script>
import { trimRaw } from "../utils/jsonStr";

export default {
  name: "panel",
  data() {
    return {
      title: "Panel in dev 3",
      lists: [],
      currentVal: "",
      currentIdx: undefined,
      right: false
    };
  },
  created() {
    chrome.devtools.network.onRequestFinished.addListener(this.cb);
  },
  filters: {
    localeTime(str) {
      return `${new Date(str).toLocaleTimeString()} ${str.slice(19, 23)}`;
    }
  },
  methods: {
    cb(res) {
      if (!res) return;
      const {
        request: { method, postData, url },
        response: { content, status, statusText }
      } = res;
      if (content.mimeType === "application/json") {
        this.lists.push({
          freeze: Object.freeze({
            res
          })
        });
      }
    },
    select(idx) {
      this.currentIdx = idx;
      const item = this.lists[idx];
      this.right = true;
      this.currentVal = "loading...";
      const {
        freeze: { res }
      } = item;
      res.getContent(content => {
        this.currentVal = trimRaw(content);
      });
    },
    unSelect() {
      this.right = false;
      this.currentIdx = undefined;
    }
  },
  mounted() {
    console.info("mounted", this);
  },
  beforeDestroy() {
    console.info("beforeDestroy");
    chrome.devtools.network.onRequestFinished.removeListener(this.cb);
  }
};
</script>
<style>
.panel {
  flex: 1;
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  color: lightcyan;
  font-family: "Courier New", Courier, monospace;
}
.left,
.right {
  flex: 1;
}
.left ul li,
.right span.close {
  cursor: pointer;
}

.left ul li.curr {
  background: rgba(255, 255, 255, 0.3);
}
</style>
