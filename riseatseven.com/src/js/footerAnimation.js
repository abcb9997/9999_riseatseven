import {
    gsap
} from 'gsap';
import {
    ScrollTrigger
} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const footerAnimationModule = () => {

    const footer = document.querySelector('.js-footer');
    const footerBackground = document.querySelector('.js-footer-background');
    const footerContent = document.querySelector('.js-footer-content');

    ScrollTrigger.matchMedia({
        '(pointer: fine)': () => {

            ScrollTrigger.create({
                trigger: footer,
                start: 'top 100%',
                end: 'bottom bottom',
                onUpdate: (update) => {

                    gsap.set(footerBackground, {
                        height: `${update.progress * 100}%`,
                    });

                },
            });

            gsap.set(footerContent, {
                opacity: 0,
            });

            gsap.to(footerContent, {
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 80%',
                    end: 'bottom 110%',
                    scrub: 1,
                }
            });

        },
        '(pointer: coarse)': () => {

            gsap.set(footerBackground, {
                height: '100%',
            });

            gsap.set(footerContent, {
                opacity: 1,
            });

        }
    });

}

export {
    footerAnimationModule
};