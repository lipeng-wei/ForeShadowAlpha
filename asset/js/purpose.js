var ForeAccordion = {
    menu 			: 	null,
    menuScroll 		: 	null,
    menuOnfTimeout  :   null
}


$(function () {


    ForeAccordion.menu = new Menu;

    ForeAccordion.menuScroll = $("#mm-menu").niceScroll({
        cursoropacitymax: 0.7,
        cursoropacitymin: 0.3,
        cursorborder: "2px solid #666666",
        cursorcolor: "#000000",
        cursorwidth: 8,
        cursorminheight: 56,
        horizrailenabled: false
    });

    ForeAccordion.menu.afterMenuOff = function(){
        //console.log('off');
        clearTimeout(ForeAccordion.menuOnfTimeout);
        ForeAccordion.menuScroll.hide();
    }
    ForeAccordion.menu.afterMenuOn = function(){
        clearTimeout(ForeAccordion.menuOnfTimeout);
        ForeAccordion.menuOnfTimeout = setTimeout(function(){
            ForeAccordion.menuScroll.show();
        }, 888);
    }

    $('.content').hide();
    $('.mm-menu__link').on("click",function(){
        var labelClicked = $(this);
        var labelContent = labelClicked.next();
        if (labelClicked.attr('id') == 'a-history' && labelContent.find('a').length < 1) {
            labelContent.append(ForeHistory.getIndexHtml());
        }
        if (labelClicked.attr('id') == 'a-favorite' && ! labelContent.is(":visible")) {
            labelContent.children('a').remove();
            labelContent.append(ForeFavorite.getIndexHtml());
        }
        $('.mm-menu__link').removeClass('mm-menu__link-selected');
        if(labelContent.is(":visible")) {
            labelContent.slideUp("slow");
        } else {
            labelClicked.addClass('mm-menu__link-selected');
            $('.content').slideUp("normal");
            labelContent.slideDown("slow");
        }
        clearTimeout(ForeAccordion.menuOnfTimeout);
        ForeAccordion.menuOnfTimeout = setTimeout(function(){
            ForeAccordion.menuScroll.checkContentSize();
            ForeAccordion.menuScroll.showCursor();
        }, 888);

    });

    setTimeout(function(){
        ForeAccordion.menuScroll.hide();
        ForeAccordion.menu.toggleMenuOn();
    }, 188);


});