<template>
  <div class="popup">
    <h1>{{ title }}</h1>
    <button @click="open('Options')">Options</button>
    <button @click="open('Tools')">Tools</button>
  </div>
</template>
<script>
import { getTab } from "src/utils";

export default {
  name: "Popup",
  data() {
    return {
      title: "Popup",
      status: "..."
    };
  },
  mounted() {
    this.detect();
  },
  methods: {
    async detect() {
      const { url } = await getTab();
      const status =
        url.indexOf("mypaas") > -1 ||
        url.indexOf("localhost") > -1 ||
        /^https?:\/\/[\d\.]{7,15}/.test(url);
      this.status = status ? "on" : "off";
    },
    open(target) {
      if (!target || typeof target !== "string") {
        return;
      }
      chrome.tabs.create({ url: `${target.toLowerCase()}.html` });
    }
  }
};
</script>
