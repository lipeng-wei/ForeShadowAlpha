


$(function () {


    $('.container').particleground({
        parallax: true,
        parallaxMultiplier: 8,
        particleRadius: 8,
        density: 10888,
        dotColor: '#336666',
        lineColor: '#336666'
    });

    $('.intro').css({
        'margin-top': -($('.intro').height() / 2)
    });
    setInterval(function(){
        var rand = parseInt(Math.random() * 3);
        var randcon = $('.enter').not('.random');
        $('.enter,.random').removeClass('random');
        randcon.eq(rand).addClass('random')

    }, 588);



});