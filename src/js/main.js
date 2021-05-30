import $ from 'jquery';
import gsap from "gsap";

let sliderAutoplay;

$(function () {
    console.log('ready');

    // slider init
    setSlides();
    setSliderAutoplay();
    $('.slider-nav .btn').on('click', function () {
        clearInterval(sliderAutoplay);
        sliderSlide($(this).data('dir'));
        setSliderAutoplay();
    });
    // slider init
    if (window.innerWidth > 992) {
        $(window).on('scroll', function () {
            var scroll = $(window).scrollTop();
            if (scroll > 100) {
                $("header").addClass("show");
            } else {
                $("header").removeClass("show");
            }
        });
    };
});
/* ---------- document ready end ---------- */


// slider logic
function sliderSlide(dir) {
    if (dir == 'next') {
        const firstSlide = $('.slider-container .slide:nth-child(1)');
        gsap.to(firstSlide, {
            scale: 1.1,
            opacity: 0,
            x: '-7.5%',
            y: '7.5%',
            duration: 0.3,
            onComplete: function () {
                $('.slider-container').append(firstSlide);
                setSlides();
            }
        });
    }
    if (dir == 'prev') {
        const lastSlide = $('.slider-container .slide:nth-last-child(1)');
        gsap.to(lastSlide, {
            scale: 1.1,
            x: '-7.5%',
            y: '7.5%',
            duration: 0.3,
            onComplete: function () {
                $('.slider-container').prepend(lastSlide);
                setSlides();
            }
        });
    }
}
function setSlides() {
    $('.slider-container .slide').each(function (i, el) {
        gsap.to(el, {
            x: (i == 0 ? i : (i + 3.5) * 25) + 'px',
            y: -(i == 0 ? i : (i + 3.5) * 20) + 'px',
            scale: i == 0 ? 1 : 0.85,
            opacity: 1,
            duration: 0.3
        });
    });
}
function setSliderAutoplay() {
    sliderAutoplay = setInterval(() => {
        sliderSlide('next');
    }, 3000);
}
// slider logic
