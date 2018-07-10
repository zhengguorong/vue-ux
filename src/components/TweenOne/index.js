// export this package's api
import TweenOne from './TweenOne.vue';
// import group from './TweenOneGroup';
import _easing from './easing';
import _plugins from './plugins';
import _ticker from './ticker';

// TweenOne.TweenOneGroup = group;
TweenOne.easing = _easing;
TweenOne.plugins = _plugins;
TweenOne.ticker = _ticker;

export default TweenOne;

// export const TweenOneGroup = group;

export const easing = _easing;

export const plugins = _plugins;

export const ticker = _ticker;
