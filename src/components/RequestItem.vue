<template>
  <div class="request-item">
    <div class="url">
      <span class="caret" :class="`m-${item.method}`">{{item.method}}</span>
      <span class="caret" :class="`s-${item.status}`">{{item.status}}</span>
      <strong>{{shortUrl[1]}}</strong>
      <br>
      {{shortUrl[0]}}
    </div>
  </div>
</template>
<script>
export default {
  name: "RequestItem",
  props: {
    item: Object
  },
  computed: {
    shortUrl() {
      const { initiator, url } = this.item;
      if (!url) return [];
      const shortUrl = url.replace(initiator, "");
      const slashIdx = shortUrl.lastIndexOf("/");
      return [shortUrl.slice(slashIdx + 1), shortUrl.slice(0, slashIdx)];
    },
    statusClass() {
      return [`m-${this.item.method}`, `s-${this.item.status}`];
    }
  }
};
</script>
<style scoped>
.caret {
  padding: 0 1px;
  display: inline-block;
  border-radius: 0.3em;
  background: #ddd;
  margin-right: 0.2em;
}
.m-GET {
  color: cornflowerblue;
}
.m-POST {
  color: gold;
  background: darkblue;
}
.s-200 {
  color: yellowgreen;
  background: #fff;
}

.s-503,
.s-500,
.s-400,
.s-403,
.s-401 {
  color: tomato;
  background: #fff;
}
.request-item {
  display: flex;
  padding: 3px 5px;
  color: #555;
}
.request-item > div {
  padding: 1px 3px;
}
.first {
  flex: 0 0 3em;
}
.url::first-line {
  color: #222;
}
.curr .request-item {
  color: #eee;
}
.curr .url::first-line {
  color: #fff;
}
</style>
