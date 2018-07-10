<script>
import { dataToArray, objectEqual } from "./util";
import Tween from "./Tween";
import ticker from "./ticker";

function noop() {}
const perFrame = Math.round(1000 / 60);

export default {
  props: {
    animation: [Object, Array],
    css: [Object],
    paused: [Boolean],
    reverse: [Boolean],
    yoyo: [Boolean],
    time: [Number],
    children: {},
    component: {
      default: "div"
    },
    componentProps: {
      default: () => {}
    },
    reverseDelay: {
      type: Number,
      default: 0
    },
    repeat: {
      type: Number,
      default: 0
    },
    attr: {
      type: String,
      default: "style"
    },
    onChange: {
      type: Function,
      default: noop
    },
    updateReStart: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    $props: {
      deep: true,
      handler(nextProps) {
        if (!this.tween && !this.dom) {
          this.updateAnim = true;
          return;
        }

        // 动画处理
        const newAnimation = nextProps.animation;
        const currentAnimation = this.$props.animation;
        const equal = objectEqual(currentAnimation, newAnimation);
        if (!equal) {
          this.setDefalut(nextProps);
          this.updateAnim = true;
        }

        // 跳帧事件 moment;
        const nextMoment = nextProps.moment;
        if (
          typeof nextMoment === "number" &&
          nextMoment !== this.$props.moment
        ) {
          if (this.tween && !this.updateAnim) {
            this.startMoment = nextMoment;
            this.startFrame = ticker.frame;
            if (nextProps.paused) {
              this.raf();
            }
            if (this.tween.progressTime >= this.tween.totalTime) {
              this.play();
            }
          } else {
            this.setDefalut(nextProps);
            this.updateAnim = true;
          }
        }

        // 暂停倒放
        if (
          this.paused !== nextProps.paused ||
          this.reverse !== nextProps.reverse
        ) {
          this.paused = nextProps.paused;
          this.reverse = nextProps.reverse;
          if (this.paused) {
            this.cancelRequestAnimationFrame();
          } else if (this.reverse && nextProps.reverseDelay) {
            this.cancelRequestAnimationFrame();
            ticker.timeout(this.restart, nextProps.reverseDelay);
          } else {
            // 在 form 状态下，暂停时拉 moment 时，start 有值恢复播放，在 delay 的时间没有处理。。
            if (this.tween) {
              this.tween.resetAnimData();
              this.tween.resetDefaultStyle();
            }
            if (!this.updateAnim) {
              this.restart();
            }
          }
        }

        const styleEqual = objectEqual(this.$props.style, nextProps.style);
        if (!styleEqual) {
          // 在动画时更改了 style, 作为更改开始数值。
          if (this.tween) {
            this.tween.reStart(this.$props.style);
          }
        }
        this.setForcedJudg(nextProps);
      }
    }
  },
  methods: {
    init(props) {
      this.rafID = -1;
      this.setDefalut(props);
      this.paused = props.paused;
      this.reverse = props.reverse;
      this.updateAnim = false;
      this.forced = {};
      this.setForcedJudg(props);
    },
    start() {
      this.updateAnim = false;
      const props = this.$props;
      if (props.animation && Object.keys(props.animation).length) {
        this.tween = new Tween(this.dom, dataToArray(props.animation), {
          attr: props.attr
        });
        this.tween.reverse = this.reverse;
        // 预先注册 raf, 初始动画数值。
        this.raf();
        // 开始动画
        this.play();
      }
    },
    frame() {
      const { yoyo } = this.$props;
      let { repeat } = this.$props;
      const totalTime =
        repeat === -1 ? Number.MAX_VALUE : this.tween.totalTime * (repeat + 1);
      repeat = repeat >= 0 ? repeat : Number.MAX_VALUE;
      let moment =
        (ticker.frame - this.startFrame) * perFrame + this.startMoment;
      if (this.reverse) {
        moment =
          (this.startMoment || 0) - (ticker.frame - this.startFrame) * perFrame;
      }
      moment = moment > totalTime ? totalTime : moment;
      moment = moment <= 0 ? 0 : moment;
      let repeatNum = Math.floor(moment / this.tween.totalTime) || 0;
      repeatNum = repeatNum > repeat ? repeat : repeatNum;
      let tweenMoment = moment - this.tween.totalTime * repeatNum;
      tweenMoment = tweenMoment < perFrame ? 0 : tweenMoment;
      if (
        repeat &&
        moment &&
        moment - this.tween.totalTime * repeatNum < perFrame
      ) {
        // 在重置样式之前补 complete；
        this.tween.frame(this.tween.totalTime * repeatNum);
      }
      if (
        (moment < this.moment && !this.reverse) ||
        (repeat !== 0 && repeatNum && tweenMoment <= perFrame)
      ) {
        // 在 form 状态下，暂停时拉 moment 时，start 有值，，往返方向播放时，在 delay 的时间没有处理。。
        // 与上面的处理一样，删除 start ，重新走一遍 start。。
        this.tween.resetAnimData();
        this.tween.resetDefaultStyle();
      }
      const yoyoReverse = yoyo && repeatNum % 2;
      if (yoyoReverse) {
        tweenMoment = this.tween.totalTime - tweenMoment;
      }
      this.tween.onChange = e => {
        const cb = {
          ...e,
          timelineMode: ""
        };
        if (
          (!moment && !this.reverse) ||
          (this.reverse && this.moment === this.startMoment)
        ) {
          cb.timelineMode = "onTimelineStart";
        } else if (
          (moment >= totalTime && !this.reverse) ||
          (!moment && this.reverse)
        ) {
          cb.timelineMode = "onTimelineComplete";
        } else if (repeatNum !== this.timelineRepeatNum) {
          cb.timelineMode = "onTimelineRepeat";
        } else {
          cb.timelineMode = "onTimelineUpdate";
        }
        this.$props.onChange(cb);
      };
      this.tween.frame(tweenMoment);
      this.moment = moment;
      this.timelineRepeatNum = repeatNum;
    },

    raf() {
      const { repeat } = this.$props;
      const totalTime =
        repeat === -1 ? Number.MAX_VALUE : this.tween.totalTime * (repeat + 1);
      this.frame();
      if ((this.moment >= totalTime && !this.reverse) ||this.paused ||(this.reverse && this.moment === 0)) {
        return this.cancelRequestAnimationFrame();
      }
      return null;
    },
    cancelRequestAnimationFrame() {
      ticker.clear(this.rafID);
      this.rafID = -1;
    },
    play() {
      this.cancelRequestAnimationFrame();
      if (this.paused) {
        return;
      }
      this.rafID = ticker.add(this.raf);
    },
    setDefalut(props) {
      {
        this.moment = props.moment || 0;
        this.startMoment = props.moment || 0;
        this.startFrame = ticker.frame;
      }
    },
    setForcedJudg(props) {
      Object.keys(this.forced).forEach(key => {
        delete this[key];
        delete this.forced[key];
      });
      if (props.forcedJudg) {
        Object.keys(props.forcedJudg).forEach(key => {
          if (!this[key]) {
            this[key] = props.forcedJudg[key];
            this.forced[key] = 1;
          }
        });
      }
    },
    _deepClone (obj) {
      let _tmp,result;
      _tmp = JSON.stringify(obj);
      result = JSON.parse(_tmp);
      return result;
    }
  },
  update() {
    if (!this.dom || this.dom.nodeName !== "#text") {
      this.dom = this.$el;
    }
    // 样式更新了后再执行动画；
    if (this.updateAnim && this.dom && this.dom.nodeName !== "#text") {
      this.start();
    }
  },
  beforeDestroy() {
    this.cancelRequestAnimationFrame();
  },
  mounted() {
    this.dom = this.$el;
    this.originProps = this._deepClone(this.$props)
    this.init(this.$props);
    if (this.dom && this.dom.nodeName !== "#text") {
      this.start();
    }
  },
  render(createElement) {
    const props = { ...this.$props };
    [
      "animation",
      "component",
      "componentProps",
      "reverseDelay",
      "attr",
      "paused",
      "reverse",
      "repeat",
      "yoyo",
      "moment",
      "resetStyleBool",
      "updateReStart",
      "forcedJudg"
    ].forEach(key => delete props[key]);
    props.style = { ...this.$props.css };
    Object.keys(props.style).forEach(p => {
      if (p.match(/filter/i)) {
        ["Webkit", "Moz", "Ms", "ms"].forEach(prefix => {
          props.style[`${prefix}Filter`] = props.style[p];
        });
      }
    });
    if (!this.$props.component) {
      if (!this.$props.children) {
        return this.$props.children;
      }
      const childrenProps = this.$props.children.props;
      const { style, className } = childrenProps;
      // 合并 style 与 className。
      const newStyle = { ...style, ...props.style };
      const newClassName = props.className
        ? `${props.className} ${className}`
        : className;
      return createElement(this.props.children, { style: newStyle, className: newClassName });
    }
    return createElement(this.$props.component, {
      ...props,
      ...this.$props.componentProps
    });
  }
};
</script>
