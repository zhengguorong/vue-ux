<template>
  <div>
    <ul>
      <li>{{number}}</li>
      <li>{{number}}</li>
      <li>{{number}}</li>
      <li>{{number}}</li>
      <li>{{number}}</li>
      <li>{{number}}</li>
    </ul>
    <button @click="start">play</button>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
export default {
  data() {
    return {
      number: 0 
    }
  },
  methods: {
    start () {
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween(this.$data).to({number: 10}, 300).start()
      animate()
    }
  }
}
</script>


<style scoped>
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style-type: none;
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: #ccc;
    border-bottom: 1px solid #fff;
  }
</style>
