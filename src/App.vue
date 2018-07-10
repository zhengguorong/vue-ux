<template>
  <div id="app">
    <div @click="onPlay">play</div>
    <div @click="onPause">pause</div>
    <div @click="onReverse">reverse</div>
    <div @click="onRestart">restart</div>
    <TweenOne
      :animation=animation
      :paused=paused
      :reverse=reverse
      :time=moment
      class="code-box-shape">
    </TweenOne>
    </div>
</template>

<script>
import TweenOne from "./components/TweenOne/index.js";

export default {
  data() {
    return {
      animation:{ left: '80%', duration: 2000 },
      paused: false,
      reverse: false,
      moment: null
    };
  },
  methods: {
    onPlay() {
      this.paused = false;
      this.reverse = false;
      this.moment = null;
    },
    onPause() {
      this.paused = true;
      this.moment = null;
    },
    onReverse() {
      this.reverse = true;
      this.paused = false;
      this.moment = null;
    },
    onRestart() {
      this.moment = 0;
      this.paused = false;
      this.reverse = false;
    }
  },
  mounted() {},
  name: "app",
  components: {
    TweenOne
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.code-box-shape {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background: #019bf0;
}
</style>
