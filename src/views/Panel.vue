<template>
  <div class="wrapper">
    <div class="panel" :style="{flexDirection: flexDirection}">
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
        <request-detail :detail="detail" @pop="unSelect"/>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce } from "lodash";
import { trimRaw } from "../utils/jsonStr";
import { getTabId, getOrigin, getHAREntries, getResContent } from "../utils";

let ORIGIN = "";

export default {
  name: "panel",
  data() {
    return {
      title: "Panel in dev 4",
      lists: [],
      currentIdx: undefined,
      right: false,
      preserve: false,
      tabId: null,
      hooked: false,
      detail: {
        requestText: "",
        responseText: ""
      },
      window: {
        innerWidth: 1000,
        innerHeight: 100
      }
    };
  },
  computed: {
    flexDirection() {
      return this.window.innerWidth > this.window.innerHeight
        ? "row"
        : "column";
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
      const vm = this;
      chrome.devtools.network.onNavigated.addListener(this.naviCb);
      chrome.devtools.network.onRequestFinished.addListener(this.cb);
      chrome.runtime.onMessage.addListener(async request => {
        if (request === "paas-panel-shown") {
          vm.clear();
        } else if (request === "paas-panel-hidden") {
        } else {
          console.info("onMessage", request);
        }
      });
      window.onresize = debounce(() => {
        vm.initBoundary();
      }, 500);
    },
    initBoundary() {
      const { innerWidth, innerHeight } = window;
      this.window = { innerWidth, innerHeight };
    },
    async loadEntries() {
      const entries = await getHAREntries();
      const cared = [];
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
        cared.push({
          _: Object.freeze({ _: [entry] }),
          initiator: ORIGIN,
          timeStamp: +new Date(startedDateTime),
          method,
          url,
          status
        });
      });
      return cared;
    },
    naviCb() {
      this.clear();
    },
    async clear() {
      this.detail = {
        requestText: "",
        responseText: ""
      };
      this.lists = await this.loadEntries();
      if (!this.lists.length) {
        this.right = false;
      }
    },
    async cb(res) {
      if (!res) return;
      if (!res.request.httpVersion.toUpperCase().startsWith("HTTP")) {
        // 只记录 HTTP
        console.info("ignore", res);
        return;
      }
      const {
        startedDateTime,
        timings: { _blocked_queueing },
        request: { url, method },
        response: { status }
      } = res;
      if (["POST", "PUT"].includes(method)) {
        console.info(method, url, res);
      }
      this.lists = await this.loadEntries();
    },
    async select(idx) {
      this.currentIdx = idx;
      const item = this.lists[idx];
      this.right = true;
      this.detail = { requestText: "", responseText: "waiting..." };
      const {
        _: {
          _: [request]
        }
      } = item;
      if (!request) return;
      const {
        request: { postData }
      } = request;
      if (postData && postData.text) {
        this.detail.requestText = postData.text;
      }
      const content = await getResContent(request);
      try {
        this.detail.responseText = trimRaw(content);
      } catch (error) {
        this.detail.responseText = content || "--";
      }
    },
    unSelect() {
      this.detail = {
        requestText: "",
        responseText: ""
      };
      this.right = false;
      this.currentIdx = undefined;
    }
  },
  async created() {
    this.initBoundary();
    const [tabId, origin] = await Promise.all([
      await getTabId(),
      await getOrigin()
    ]);
    ORIGIN = origin;
    this.tabId = tabId;
    this.lists = await this.loadEntries();
    if (!tabId) {
      console.warn("hook failed");
    } else {
      this.addHooks();
    }
  },
  beforeDestroy() {
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
  color: #333;
  font-family: "Courier New", Courier, monospace;
  overflow: hidden;
}
.left,
.right {
  flex: 2 0 40%;
  overflow: auto;
}
.right {
  flex: 3 0 60%;
}
.left > ul > li:nth-child(odd) {
  background: #f5f5f5;
}
.left ul li,
.right span.close {
  cursor: pointer;
}
.left ul li {
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
  overflow: hidden;
}
.left ul li.curr {
  background: #569aff;
  color: #fff;
}
</style>
