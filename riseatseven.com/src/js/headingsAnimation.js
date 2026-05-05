import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
import {
    SplitText
} from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Utility: debounce function
const debounce = (func, wait) => {

    let timeout;

    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };

};

// Utility: set marginRight for words
const setWordsMarginRight = (heading) => {

    const headingHeight = parseFloat(window.getComputedStyle(heading).lineHeight);

    ScrollTrigger.matchMedia({
        '(pointer: fine)': () => {

            heading.querySelectorAll('.js-word').forEach(word => {
                gsap.set(word, {
                    marginRight: `${headingHeight * 0.15}px`,
                });
            });

        }
    });

};

// Utility: set marginRight for imageWrappers
const setImageWrappersMarginRight = (heading) => {

    const lineHeight = parseFloat(window.getComputedStyle(heading).lineHeight);

    ScrollTrigger.matchMedia({
        '(pointer: fine)': () => {

            heading.querySelectorAll('.js-image-wrapper').forEach(wrapper => {
                gsap.set(wrapper, {
                    marginRight: `${lineHeight * 0.15}px`,
                });
            });

        }
    });

};

const headingsAnimationModule = () => {

    document.querySelectorAll('.js-heading-animate').forEach(heading => {

        const delay = parseFloat(heading.dataset.delay) || 0.2;

        ScrollTrigger.matchMedia({
            '(pointer: fine)': () => {
                // Only split text and apply animations for fine pointer devices
                const {
                    chars,
                    lines
                } = new SplitText(heading, {
                    type: 'chars, words, lines',
                    linesClass: 'w-full',
                    reduceWhiteSpace: false
                });

                setWordsMarginRight(heading);

                const words = heading.querySelectorAll('.js-word');

                words.forEach((word, i) => {

                    const headingHeight = parseFloat(window.getComputedStyle(heading).lineHeight);
                    gsap.set(word, {
                        marginRight: `${headingHeight * 0.15}px`,
                    });

                });

                chars.forEach((char, i) => {

                    const container = document.createElement('span');
                    container.className = 'inline-flex flex-col relative h-full';

                    const animSpan = document.createElement('span');

                    animSpan.textContent = char.textContent;
                    animSpan.className = 'block relative w-full h-full';

                    char.replaceWith(container);
                    container.appendChild(animSpan);

                    gsap.set(animSpan, {
                        y: '125%'
                    });

                    gsap.to(animSpan, {
                        y: '0%',
                        duration: 0.5,
                        ease: 'power4.out',
                        delay: delay + i * 0.015,
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                        }
                    });

                });

                // Animate images
                const imageWrappers = heading.querySelectorAll('.js-image-wrapper');

                setImageWrappersMarginRight(heading);

                imageWrappers.forEach((wrapper, i) => {

                    const lineHeight = parseFloat(window.getComputedStyle(heading).lineHeight);

                    gsap.set(wrapper, {
                        height: 'auto',
                        width: '0px',
                        borderRadius: '15%',
                    });

                    // animate the width
                    gsap.to(wrapper, {
                        width: lineHeight + 'px',
                        duration: 0.7,
                        ease: 'power4.out',
                        delay: (delay + i * 0.03) + 0.6,
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 85%",
                        }
                    });

                });
            },
            '(pointer: coarse)': () => {
                // For touch devices, just set up image wrappers without text splitting
                const imageWrappers = heading.querySelectorAll('.js-image-wrapper');

                imageWrappers.forEach((wrapper, i) => {
                    const lineHeight = parseFloat(window.getComputedStyle(heading).lineHeight);

                    gsap.set(wrapper, {
                        width: lineHeight + 'px',
                        borderRadius: '15%',
                    });
                });
            }
        });

    });

    document.querySelectorAll('.js-heading').forEach(heading => {

        setImageWrappersMarginRight(heading);

        heading.querySelectorAll('.js-image-wrapper').forEach((wrapper, i) => {
            const lineHeight = parseFloat(window.getComputedStyle(heading).lineHeight);

            gsap.set(wrapper, {
                width: lineHeight + 'px',
                borderRadius: '15%',
            });

            setWordsMarginRight(heading);

        });

    });

    // Debounced resize handler
    const updateMargins = debounce(() => {

        document.querySelectorAll('.js-heading-animate, .js-heading').forEach(heading => {

            setWordsMarginRight(heading);
            setImageWrappersMarginRight(heading);

            // Update width of imageWrappers based on lineHeight
            const lineHeight = parseFloat(window.getComputedStyle(heading).lineHeight);

            heading.querySelectorAll('.js-image-wrapper').forEach(wrapper => {
                gsap.set(wrapper, {
                    width: `${lineHeight}px`
                });
            });

        });

    }, 100);

    window.addEventListener('resize', updateMargins);

}

export {
    headingsAnimationModule
};