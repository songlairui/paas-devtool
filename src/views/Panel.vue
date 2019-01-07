<template>
  <div class="wrapper">
    <div class="configure">
      <text-btn label="清空" @click="clear"/>
      <switcher label="保留记录" v-model="preserve"/>
      <text-btn label="debug" :l="5" @click="debug"/>
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
import { getTabId, getOrigin, getHAREntries, getResContent } from "../utils";

let ORIGIN = "";
let sparseMarks = [];
let beginStamp = +new Date();

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
    ORIGIN = origin;
    this.tabId = tabId;
    await this.initPreserveLogs();
    if (!tabId) {
      console.warn("hook failed");
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
    async initPreserveLogs() {
      const entries = await getHAREntries();
      if (!entries.length) return;
      entries.forEach(entry => {
        const {
          startedDateTime,
          request: { method, httpVersion, url },
          response: {
            content: { mimeType },
            status
          }
        } = entry;
        if (!httpVersion.startsWith("HTTP")) return;
        if (mimeType !== "application/json") return;
        this.lists.push({
          _: Object.freeze({ _: [entry] }),
          initiator: ORIGIN,
          timeStamp: +new Date(startedDateTime),
          method,
          url,
          status
        });
      });
    },
    addHooks() {
      if (this.hooked || !this.tabId) return;
      this.hooked = true;
      chrome.devtools.network.onNavigated.addListener(this.naviCb);
      chrome.devtools.network.onRequestFinished.addListener(this.cb);
      chrome.webRequest.onBeforeRequest.addListener(
        this.markCb,
        { urls: ["<all_urls>"], tabId: this.tabId },
        ["blocking", "requestBody"]
      );
    },
    debug() {
      console.info("this", this.lists, sparseMarks);
    },
    markCb(request) {
      if (!request) return;
      if (request.type !== "xmlhttprequest") return;
      ["frameId", "tabId", "parentFrameId", "type"].forEach(key => {
        delete request[key];
      });
      // place a freeze place
      request.status = -1;
      request._ = Object.freeze({ _: [] });
      this.lists.push(request);
      // 乐观认为统一毫秒之内，请求不超过10个，观测到的最多两个
      let key = parseInt(request.timeStamp - beginStamp) * 10;
      const end = key + 10;
      while (sparseMarks[key]) {
        if (key >= end) {
          console.warn("too dense request");
          return;
        }
        // 向后逐个尝试存储
        key++;
      }
      sparseMarks[key] = request;
    },
    naviCb() {
      if (this.preserve) return;
      this.clear();
    },
    clear() {
      sparseMarks = [];
      this.lists = [];
    },
    cb(res) {
      if (!res) return;
      if (!res.request.httpVersion.startsWith("HTTP")) {
        // 只记录 HTTP
        return;
      }
      const {
        startedDateTime,
        timings: { _blocked_queueing },
        request: { url, method },
        response: { status }
      } = res;
      const startKey =
        (+new Date(res.startedDateTime) -
          beginStamp +
          Math.floor(_blocked_queueing)) *
        10;
      const endKey = startKey + 20; // 两部分均由floor变为ceil，则误差范围为10的2倍
      // 稀疏数组不会遍历间隙
      const targetIdx = sparseMarks
        .slice(startKey, endKey)
        .findIndex(target => {
          if (!target) return;
          try {
            const needFillRes = !target._._[0];
            const urlEqual = url === target.url;
            const methodEqual = method === target.method;
            if (!needFillRes || !urlEqual || !methodEqual) return false;
            return true;
          } catch (error) {
            return false;
          }
        });
      if (targetIdx === -1) {
        // 忽略
        return;
      }
      const targetItem = sparseMarks[startKey + targetIdx];
      targetItem._._[0] = res;
      targetItem.status = status;
      delete sparseMarks[startKey + targetIdx];
    },
    async select(idx) {
      this.currentIdx = idx;
      const item = this.lists[idx];
      this.right = true;
      this.currentVal = "parsing...";
      const {
        _: {
          _: [request]
        }
      } = item;
      const content = await getResContent(request);
      this.currentVal = content
        ? JSON.stringify(JSON.parse(trimRaw(content)), null, 1)
        : "--";
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
  width: 100%;
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
.left > ul > li:nth-child(odd) {
  background: #f5f5f5;
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
  background: #569aff;
  color: #fff;
}
.configure {
  background: #f8f9fd;
  border-bottom: thin solid silver;
}
</style>
