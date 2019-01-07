<template>
  <div class="wrapper">
    <div class="configure">
      <text-btn label="清空" @click="clear"/>
      <switcher label="保留记录" v-model="preserve"/>
      <text-btn label="👂" :l="2" @click="addHooks" v-if="!hooked"/>
    </div>
    <div class="panel">
      <div class="left">
        <ul>
          <li
            :class="{curr:idx ===currentIdx}"
            v-for="(item, idx) in lists"
            :key="idx"
            @click="select(idx)"
          >
            <request-item :item="item"/>
          </li>
        </ul>
      </div>
      <div class="right" v-if="right">
        <span class="close" @click="unSelect">x</span>
        <pre>{{currentVal}}</pre>
      </div>
    </div>
  </div>
</template>
<script>
import { trimRaw } from "../utils/jsonStr";
import { getTabId, getOrigin } from "../utils";

let ORIGIN = "";
let pool = {};

export default {
  name: "panel",
  data() {
    return {
      title: "Panel in dev 3",
      lists: [],
      currentVal: "",
      currentIdx: undefined,
      right: false,
      preserve: false,
      tabId: null,
      hooked: false
    };
  },
  async created() {
    const [tabId, origin] = await Promise.all([
      await getTabId(),
      await getOrigin()
    ]);
    console.info({ tabId, origin });
    ORIGIN = origin;
    this.tabId = tabId;
    if (!tabId) {
      console.info("hook by self", this);
    } else {
      this.addHooks();
    }
  },
  filters: {
    localeTime(str) {
      return `${new Date(str).toLocaleTimeString()} ${str.slice(19, 23)}`;
    },
    omitOrigin(url) {
      return url.replace(origin, "");
    }
  },
  methods: {
    addHooks() {
      if (this.hooked || !this.tabId) return;
      this.hooked = true;
      chrome.devtools.network.onNavigated.addListener(this.naviCb);
      chrome.devtools.network.onRequestFinished.addListener(this.cb);
      chrome.webRequest.onBeforeRequest.addListener(
        this.markCb,
        // filters
        { urls: ["<all_urls>"], tabId: this.tabId },
        // extraInfoSpec
        ["blocking", "requestBody"]
      );
    },
    markCb(request) {
      console.info("req", request);
      this.lists.push(request);
      const key = parseInt(request.timeStamp);
      if (!pool[key]) {
        pool[key] = [];
      }
    },
    naviCb() {
      if (this.preserve) return;
      this.clear();
    },
    clear() {
      pool = {};
      this.lists = [];
    },
    cb(res) {
      console.warn("cb");
      const stampKey = res.startedDateTime;
      if (!pool[stampKey]) {
        console.warn("no start time", stampKey);
      } else {
        pool[stampKey].push(res);
      }
      return;
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
        this.currentVal = content
          ? JSON.stringify(JSON.parse(trimRaw(content)), null, 1)
          : "--";
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
.wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.panel {
  flex: 1;
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  color: #569aff;
  font-family: "Courier New", Courier, monospace;
  overflow: hidden;
}
.left,
.right {
  flex: 1 0 50%;
  height: 100%;
  overflow: auto;
}
.left ul li,
.right span.close {
  cursor: pointer;
}
.left ul li {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.left ul li.curr {
  background: rgba(255, 255, 255, 0.3);
}
.configure {
  background: #f8f9fd;
  border-bottom: thin solid silver;
}
</style>
