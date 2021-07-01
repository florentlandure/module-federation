<template>
  <div id="app">
    <h1>Vue addon with routing</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import router from "./router";

export default {
  router,
  name: "App",
  components: {},
};
</script>

<style>
#app {
  box-sizing: border-box;
  display: block;
  height: 100%;
  width: 100%;

  border: 2px solid green;
  padding: 1rem;
}
</style>
