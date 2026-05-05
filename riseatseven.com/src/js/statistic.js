import {
    gsap
} from 'gsap';
import {
    ScrollTrigger
} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const statisticModule = () => {

    const statistics = document.querySelectorAll('.js-statistic');

    statistics.forEach(statistic => {

        const character = statistic.dataset.character;
        const delay = statistic.dataset.delay;

        let goToCharacterPosition = statistic
            .querySelector(`.js-statistic-character[data-character='${character}']`)
            .offsetTop;

        let goToCharacterWidth = statistic
            .querySelector(`.js-statistic-character[data-character='${character}']`)
            .offsetWidth;

        createStatisticTimeline(statistic, goToCharacterWidth, goToCharacterPosition);

        let resizeTimer;

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                goToCharacterWidth = statistic
                    .querySelector(`.js-statistic-character[data-character='${character}']`)
                    .offsetWidth;

                goToCharacterPosition = statistic
                    .querySelector(`.js-statistic-character[data-character='${character}']`)
                    .offsetTop;

                // Kill existing timeline and create new one
                if (statistic.timeline) {
                    statistic.timeline.kill();
                }
                createStatisticTimeline(statistic, goToCharacterWidth, goToCharacterPosition);

            }, 250);
        });

    });

    function createStatisticTimeline(statistic, goToCharacterWidth, goToCharacterPosition) {

        // Create timeline and pause it initially
        statistic.timeline = gsap.timeline({
            paused: true
        });

        // Add animations to timeline
        statistic.timeline
            .to(statistic.querySelectorAll(`.js-statistic-characters > div`), {
                duration: 1.5,
                y: -goToCharacterPosition,
                ease: 'power4.inOut',
            })
            .to(statistic, {
                duration: 0.5,
                width: goToCharacterWidth,
                ease: 'power1.out',
            }, 0) // Start at same time as first animation
            .to(statistic, {
                filter: 'blur(0px)',
                duration: 1,
                delay: 0.2,
            }, 0.2); // Start 0.2 seconds after timeline begins

        // Create ScrollTrigger to play timeline when statistic comes into view
        ScrollTrigger.create({
            trigger: statistic,
            start: 'top 90%',
            onEnter: () => {
                statistic.timeline.play();
            },
            onLeave: () => {
                statistic.timeline.reverse();
            },
            onEnterBack: () => {
                statistic.timeline.play();
            },
            onLeaveBack: () => {
                statistic.timeline.reverse();
            }
        });

    }

}

export {
    statisticModule
};