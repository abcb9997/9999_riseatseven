import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import Swiper from 'swiper';
import {
    Autoplay,
    EffectFade,
    Navigation,
    Pagination
} from 'swiper/modules';
import {
    gsap
} from 'gsap';
import {
    SplitText
} from 'gsap/SplitText';
import {
    ScrollTrigger
} from 'gsap/ScrollTrigger';
import {
    ScrollToPlugin
} from 'gsap/ScrollToPlugin';
import {
    gsapHorizontalLoop
} from './gsapHorizontalLoop';
import {
    gsapVerticalLoop
} from './gsapVerticalLoop';
import Cookies from 'js-cookie';
import Lenis from 'lenis';
import barba from '@barba/core';

import {
    headingsAnimationModule
} from './headingsAnimation';
import {
    siteBuildModule,
    setMaskColour,
    getNextMaskColour,
    currentMaskColour
} from './siteBuild';
import {
    footerAnimationModule
} from './footerAnimation';
import {
    statisticModule
} from './statistic';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

Swiper.use([Autoplay, EffectFade, Navigation, Pagination]);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

siteBuildModule();
footerAnimationModule();
headingsAnimationModule();
statisticModule();

// Components

// Global
window.Swiper = Swiper;
window.Alpine = Alpine;
window.gsap = gsap;
window.ScrollToPlugin = ScrollToPlugin;
window.ScrollTrigger = ScrollTrigger;
window.SplitText = SplitText;
window.gsapHorizontalLoop = gsapHorizontalLoop;
window.gsapVerticalLoop = gsapVerticalLoop;
window.Cookies = Cookies;
window.Lenis = Lenis;
window.barba = barba;
window.headingsAnimationModule = headingsAnimationModule;

// Inits
Alpine.plugin(collapse);
Alpine.start();