import barba from '@barba/core';
import htmx from 'htmx.org';
import {
    gsap
} from "gsap";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);

import {
    footerAnimationModule
} from './footerAnimation';
import {
    headingsAnimationModule
} from './headingsAnimation';
import {
    statisticModule
} from './statistic';

const maskColours = ['#ffffff', '#1A1A1A', '#B2F6E3'];
let maskIndex = 0;
let currentMaskColour = maskColours[maskIndex];

const setMaskColour = (colour) => {

    document.documentElement.style.setProperty('--mask-colour', colour);
    document.body.style.setProperty('--mask-colour', colour);
    currentMaskColour = colour;

};

const getNextMaskColour = () => {

    maskIndex = (maskIndex + 1) % maskColours.length;
    return maskColours[maskIndex];

};

const loadHubspotScripts = () => {

    var hubspotForm = document.querySelectorAll(".js-hubspot-form");

    hubspotForm.forEach(form => {

        var scripts = form.querySelectorAll("script");

        if (scripts !== null && scripts.length > 0) {

            var loadScript = index => {

                if (index < scripts.length) {

                    var newScript = document.createElement("script");
                    var dataSrc = scripts[index].getAttribute("data-src");

                    if (dataSrc) {
                        newScript.src = dataSrc;
                    } else {
                        newScript.src = scripts[index].src;
                    }

                    scripts[index].parentNode.removeChild(scripts[index]);

                    newScript.addEventListener("load", event => loadScript(index + 1));
                    newScript.addEventListener("error", event => loadScript(index + 1));
                    form.appendChild(newScript);

                }

            }

            loadScript(0);
        }

    });

};

const siteBuildModule = () => {

    ScrollTrigger.matchMedia({


        "(pointer: fine)": function() {

            loadHubspotScripts();

            const lenis = new Lenis({
                autoRaf: true,
                duration: 0.8,
                anchors: true,
                prevent: (node) => node.classList ? .contains('js-modal')
            });

            lenis.on('scroll', ScrollTrigger.update);



            barba.init({
                sync: true,
                transitions: [{
                    name: 'fade',
                    leave(data) {

                        // Set colour

                        let nextColour;

                        if (data.trigger && data.trigger.hasAttribute && data.trigger.hasAttribute('data-colour')) {
                            nextColour = data.trigger.getAttribute('data-colour');
                        } else {
                            nextColour = getNextMaskColour();
                        }

                        setMaskColour(nextColour);

                        // Leave mask

                        const leaveEllipse = document.querySelector('.js-leave-ellipse');
                        const leaveSvg = document.querySelector('.js-leave-svg');

                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;

                        leaveSvg.setAttribute('viewBox', `0 0 ${viewportWidth} ${viewportHeight}`);

                        const maxDistance = Math.sqrt(Math.pow(viewportWidth / 2, 2) + Math.pow(viewportHeight, 2));

                        leaveEllipse.setAttribute('cx', viewportWidth / 2);
                        leaveEllipse.setAttribute('cy', viewportHeight * 1.2);

                        gsap.to(leaveEllipse, {
                            attr: {
                                rx: maxDistance * 1.6,
                                ry: maxDistance * 1
                            },
                            duration: 1,
                            ease: 'power2.inOut'
                        });

                        // Delay whilst the leave mask is animating

                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                            }, 1000);
                        });

                    },
                    beforeEnter(data) {

                        lenis.scrollTo(0, {
                            immediate: true,
                            duration: 0
                        });

                        setMaskColour(currentMaskColour);

                    }
                }],
            });

            // Hooks
            barba.hooks.beforeEnter(({
                next
            }) => {

                htmx.process(next.container);

            });

            barba.hooks.after(() => {

                // Reset

                document.body.style.cursor = 'default';
                document.body.classList.remove('hide-cursor');
                document.documentElement.classList.remove('hide-cursor');

                window.ScrollTrigger = ScrollTrigger;
                window.htmx = htmx;
                window.barba = barba;

                ScrollTrigger.refresh();

                footerAnimationModule();
                headingsAnimationModule();
                statisticModule();
                loadHubspotScripts();

                // Reset leave mask

                const leaveEllipse = document.querySelector('.js-leave-ellipse');

                gsap.set(leaveEllipse, {
                    attr: {
                        rx: 500,
                        ry: 0
                    }
                });

                leaveEllipse.setAttribute('cx', '50%');
                leaveEllipse.setAttribute('cy', '120%');

                // Hack for autoplaying videos on page load
                var videos = document.querySelectorAll("video");
                videos.forEach(video => {
                    var playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.then(_ => {}).catch(error => {});
                    };
                });

                document.dispatchEvent(new CustomEvent('barba:after'));


            });
        },
        "(pointer: coarse)": function() {

        }
    });

}

export {
    siteBuildModule,
    setMaskColour,
    getNextMaskColour,
    currentMaskColour
};