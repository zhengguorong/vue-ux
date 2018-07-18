<script>
export default {
  props: ['test'],
  mounted () {
    setTimeout(() => {
      console.log('change Data')
      // this.myObj = {a: 3333, b: 666}
      // this.myData.a = 'hhhh'
      this.$set(this.myObj, 'a', 'hhhh')
    }, 1000);
  },
  data() {
    return {
      myData: '23333',
      myObj: {
        a: 123,
        b: 456
      }
    }
  },
  render (createElement) {
    console.log('render')
    console.log(this.$props.test)
    console.log(this.myObj.a)
    let tag = createElement('li', this.$props.test)
    return createElement('li', {style: {color: '#000'}}, [tag])
  }
}
</script>

