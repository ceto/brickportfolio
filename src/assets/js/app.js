import $ from 'jquery';
import 'what-input';
import 'slick-carousel';
import AOS from 'aos';
import 'jquery-inview';

// Foundation JS relies on a global variable. In ES6, all imports are hoisted
// to the top of the file so if we used `import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

AOS.init({
    offset: 48,
    duration: 400,
    easing: "ease-in-out-sine",
    delay: 0,
    once: true,
    //anchor-placement: 'top-bottom',
    disable: "mobile"
});


var slickIsChanging = false;

const $homecarousel = $('.homecarousel');
const $navcarousel = $('.navcarousel');

var bigLeft = $homecarousel.offset().left;
var ipanelPad = document.documentElement.clientWidth / 100 * 3;
var containerWidth = $homecarousel.innerWidth();
var isTrackpad = false;

$(window).bind('resize', function () {
    bigLeft = $homecarousel.offset().left;
    ipanelPad = document.documentElement.clientWidth / 100 * 3;
    containerWidth = $homecarousel.innerWidth();
});


function detectTrackPad(e) {
    isTrackpad = false;
    if (e.wheelDeltaY) {
        // console.log(e.wheelDeltaY +' | ' + (e.deltaY * -3));
        if (e.wheelDeltaY === (e.deltaY * -3)) {
            isTrackpad = true;
        }
    }
    else if (e.deltaMode === 0) {
        isTrackpad = true;
    }
    console.log(isTrackpad ? "Trackpad detected" : "Mousewheel detected");
}

document.addEventListener("mousewheel", detectTrackPad, false);
document.addEventListener("DOMMouseScroll", detectTrackPad, false);

// Pause all videos
// document.querySelectorAll('video').forEach(vid => vid.pause());

//Videos autostart/pause
$('video').bind('inview', function (event, visible, topOrBottomOrBoth) {
    if (visible == true) {
      this.play();
    } else {
      this.pause();
    }
});


$homecarousel
    .on("init", function (event, slick) {

        //slick slider callback must be defined before creating slick object
        mouseWheel($homecarousel);
        var elSlide = $(slick.$slides[slick.slickGetOption('initialSlide')]);

        $('.carouselstatus').html('page 1 of ' + slick.$slides.length);

        
        // $('.carouselstatus').html(currentSlide+1 + ' of <em>' + 'lorem ipsum' + '</em>');

        // if ($(elSlide).find('video').length) {
        //     $(elSlide).find('video').get(0).play();
        // }

    })
    .on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        slickIsChanging = true;
        
        // // Pause all videos
        // document.querySelectorAll('video').forEach(vid => vid.pause());

        $('.carouselstatus').addClass('willchange');
    })
    .on('afterChange', function (event, slick, currentSlide) {
        slickIsChanging = false;
        var elSlide = $(slick.$slides[currentSlide]);
        var matrix = $(elSlide).closest('.slick-track').css('transform').replace(/[^0-9\-.,]/g, '').split(',');
        var x = parseInt(matrix[12] || matrix[4]);

        // if ($(elSlide).find('video').length) {
        //     $(elSlide).find('video').get(0).play();
        // }

      
        $('.carouselstatus').html('page ' + (currentSlide+1) + ' of ' + slick.$slides.length);
        // console.log($(elSlide).find('.citem').innerWidth() + '-' + containerWidth);
        
        $('.carouselstatus').removeClass('willchange');
        
    })
    .slick({
        arrows: false,
        infinite: false,
        initialSlide: 0,
        centerMode: true,
        centerPadding: 0,
        slidesToShow: 1,
        variableWidth: false,
        verticalSwiping: false,
        draggable: false,
        asNavFor: '.navcarousel',
        // focusOnSelect: true,
        speed: 300,
        // cssEase: 'ease-out',
        // easing: 'ease-out',
        useCSS: false,
        // useTransform: false
        fade: true,
        cssEase: 'linear'

    });

$navcarousel.slick({
    arrows: false,
    infinite: false,
    initialSlide: $homecarousel.slick('slickGetOption', 'initialSlide'),
    centerMode: true,
    centerPadding: 0,
    slidesToShow: 11,
    variableWidth: true,
    asNavFor: '.homecarousel',
    focusOnSelect: true,
    speed: $homecarousel.slick('slickGetOption', 'speed'),
    cssEase: 'ease-out',
    // easing: 'ease-out'
});



function mouseWheel($homecarousel) {
    $homecarousel.on(
        "mousewheel DOMMouseScroll wheel MozMousePixelScroll",
        {
            $homecarousel: $homecarousel
        },
        mouseWheelHandler
    );
}



function mouseWheelHandler(event) {
    // console.log(event);
    event.preventDefault();
    // event.stopPropagation();
    var $slideContainer = $(this);
    if ($slideContainer.find('.slick-current').find('.citem.is-open').length > 0) {
        $slideContainer.find('.slick-current').find('.citem.is-open').removeClass('is-open');
        $('.carouselstatus').removeClass('willchange');
        $slideContainer.addClass('scrolling');
    } else {
        if (!$slideContainer.hasClass('scrolling') && slickIsChanging == false) {
            $slideContainer.addClass('scrolling');
            var $homecarousel = event.data.$homecarousel;
            var delta = event.originalEvent.deltaY;
            if (delta > 0) {
                if (($homecarousel.slick('slickCurrentSlide') + 1) < $homecarousel.slick('getSlick').slideCount) {
                    $homecarousel.slick('slickNext', false);
                }
            } else {
                if ($homecarousel.slick('slickCurrentSlide') > 0) { $homecarousel.slick('slickPrev', false); }
            }
        }
    }

    if (!isTrackpad) {
        setTimeout(function () {
            $slideContainer.removeClass('scrolling');
        }, 300);
    } else {
        setTimeout(function () {
            $slideContainer.removeClass('scrolling');
        }, 1000);
    }
}


$('.slick-arrow').on('click', function (e) {
    var $this = $(this);
    e.preventDefault();
    var $slideContainer = $('.homecarousel');
    if ($slideContainer.find('.slick-current').find('.citem.is-open').length > 0) {
        $slideContainer.find('.slick-current').find('.citem.is-open').removeClass('is-open');
        $('.carouselstatus').removeClass('willchange');
        $slideContainer.addClass('scrolling');
    } else {
        if (!$slideContainer.hasClass('scrolling') && slickIsChanging == false) {
            $slideContainer.addClass('scrolling');
            if ($this.hasClass('slick-next')) {
                if (($homecarousel.slick('slickCurrentSlide') + 1) < $homecarousel.slick('getSlick').slideCount) {
                    $homecarousel.slick('slickNext', false);
                }
            } else {
                if ($homecarousel.slick('slickCurrentSlide') > 0) { $homecarousel.slick('slickPrev', false); }
            }
        }
    }

    setTimeout(function () {
        $slideContainer.removeClass('scrolling');
    }, 300);
});


$('.carouselstatus').on('click', function(e) {
    $('.carouselstatus').toggleClass('willchange');
    $('.slick-current .citem').toggleClass('is-open');

});

$('.citem figure').on('click', 'a', function (e) {

    var $this = $(this);

    if ($(this).closest('.slick-slide').hasClass('slick-current') && $(this).closest('.citem').find('.ipanel').length) {
        if ($(this).closest('.citem').hasClass('is-open')) {
            $(this).closest('.citem').removeClass('is-open');
            $('.carouselstatus').removeClass('willchange');
        } else {
            $(this).closest('.citem').addClass('is-open');
            $('.carouselstatus').addClass('willchange');
        }
    }
    if (!$(this).closest('.slick-slide').hasClass('slick-current')) {

        if ($('.slick-current').find('.citem.is-open').length > 0) {
            $('.slick-current').find('.citem').removeClass('is-open');
        } else {
            var activeseslide = $('.slick-current').attr('data-slick-index');
            if ($this.closest('.slick-slide').attr('data-slick-index') > activeseslide) {
                $homecarousel.slick('slickNext', false);
            } else {
                $homecarousel.slick('slickPrev', false);
            }

        }



    }
});

$('.slidecard figure').on('click', 'a', function (e) {
    e.preventDefault();
    if ($(this).closest('.slidecard').find('.ipanel').length) {
        if (!$(this).closest('.slidecard').hasClass('is-open')) {
            $(this).closest('.slidecard').addClass('is-open');
        } else {
            $(this).closest('.slidecard').removeClass('is-open');
        }
    }
});

// $(document).ready(function(){
//     alert('kész');
// });





