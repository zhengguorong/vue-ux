<template>
  <div id="app">
    <!-- <div @click="onPlay">play</div>
    <div @click="onPause">pause</div>
    <div @click="onReverse">reverse</div>
    <div @click="onRestart">restart</div>
    <div @click="onMoment">moment to 500</div> -->
    <!-- <TweenOne
      :animation=animation
      class="code-box-shape">
    </TweenOne> -->
    <QueueAnim :forcedReplay="forcedReplay" :interval=100 :duration=3000>
        <li>no key</li>
        <li v-for="item in items" :key="item.key">{{item.children}}</li>
    </QueueAnim>
    <button @click="removeAll">移出所有</button>
    <button @click="add">add</button>
    <button @click="update">update</button>
    <button @click="addOne">addOne</button>
    <!-- <List :test="test"></List>
    <button @click="changeTest">changeTest</button> -->
    </div>
</template>

<script>
import TweenOne from "./components/TweenOne/index.js";
import QueueAnim from "./components/QueueAnim/index.js";
import List from "./components/List.vue";

export default {
  data() {
    return {
      test: "123",
      forcedReplay: false,
      animation: { left: "80%", interval: 30000, duration: 100000 },
      paused: true,
      reverse: false,
      moment: null,
      reverseDelay: 0,
      items: [
        // {
        //   children: "依次进入1",
        //   key: 1
        // },
        // {
        //   children: "依次进入2",
        //   key: 2
        // },
        // {
        //   children: "依次进入3",
        //   key: 3
        // },
        // {
        //   children: "依次进入4",
        //   key: 4
        // },
        // {
        //   children: "依次进入5",
        //   key: 5
        // },
        // {
        //   children: "依次进入6",
        //   key: 6
        // }
      ]
    };
  },
  methods: {
    changeTest() {
      this.test = "zgrgg";
    },
    removeAll() {
      this.items = [];
    },
    update() {
      this.forcedReplay = true;
    },
    animConfigFunc(e) {
      if (e.key === 3) {
        return { opacity: [1, 0], translateX: [0, 30] };
      }
      return [
        { opacity: [1, 0], translateX: [0, -30] },
        { opacity: [1, 0], translateX: [0, 30] }
      ];
    },
    easeFunc (e) {
      if (e.key === 3) {
        console.log(e.key)
        return ['easeOutBack', 'easeInBack'];
      }
      return 'easeInOutQuart';
    },
    add() {
      console.log("add");
      this.items = [
        {
          children: "依次进入1",
          key: 1
        },
        {
          children: "依次进入2",
          key: 2
        },
        {
          children: "依次进入3",
          key: 3
        },
        {
          children: "依次进入4",
          key: 4
        },
        {
          children: "依次进入5",
          key: 5
        },
        {
          children: "依次进入6",
          key: 6
        }
      ];
    },
    addOne() {
      this.items.push({
        children: "依次进入7",
        key: 7
      });
    },
    onPlay() {
      this.paused = false;
      this.reverse = false;
      this.moment = 0;
    },
    onPause() {
      this.paused = true;
      this.moment = null;
    },
    onReverse() {
      this.reverse = true;
      this.paused = false;
      this.moment = null;
      this.reverseDelay = 0;
    },
    onRestart() {
      this.moment = 1;
      this.paused = false;
      this.reverse = false;
    },
    onMoment() {
      this.moment = 500;
    }
  },
  mounted() {},
  name: "app",
  components: {
    TweenOne,
    QueueAnim,
    List
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
.queue-anim-entering {
  background: #2db7f5;
}

.queue-anim-leaving {
  background: #f60;
}
</style>
