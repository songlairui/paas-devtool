<template>
  <div class="request-item">
    <div class="first">
      {{item.method}}
      <br>
      {{item.status}}
    </div>
    <div class="url">
      {{shortUrl[0]}}
      <br>
      {{shortUrl[1]}}
    </div>
    <div class="stamp">{{item.timeStamp}}</div>
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
    }
  }
};
</script>
<style scoped>
.request-item {
  display: flex;
}
.request-item > div {
  padding: 1px 3px;
}
.first {
  flex: 0 0 3em;
}
</style>
