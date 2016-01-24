

$(function() {

    nScrollor = $("html").niceScroll({
        cursoropacitymax: 0.7,
        cursoropacitymin: 0.3,
        cursorborder: "2px solid #666666",
        cursorcolor: "#000000",
        cursorwidth: 8,
        cursorminheight: 56,
        zindex: 1024,
        horizrailenabled: true
    });

    $('#search_input').val("");

    $('#search_list').find('a').mouseover(function(){
        $('#search_list').find('a').attr('class', 'search-a-select');
        $(this).attr('class', 'search-a-selected');
    });
    $('#search_list').find('a').mouseout(function(){
        $(this).attr('class', 'search-a-select');
    });


    //检索
    $('#search_input').searchFilter('#search_list',{
        timeout: 588,
        callback:function(numShown, firstShown, filter){
            //console.log($(firstShown).text());
            //console.log(filter);
            nScrollor.doScrollTop(0);
            $('#search_list a').attr('class', 'search-a-select');
            if (filter){
                $(firstShown).mouseover();
            }
        }
    });

    //键盘事件 input获得焦点
    $(document).keydown(function(event){
        //console.log(event.keyCode);
        nScrollor.doScrollTop(0);
        if(event.keyCode == 27){
            //ESC键取消
            $('#search_input').val("").change();
            event.preventDefault();
        } else if (event.keyCode == 13){
            event.preventDefault();

            //回车 打开第一个选中的a链接
            var firstLink = $("#search_list a[display!='none'][class='search-a-selected']").first();
            //console.log(firstLink.length);
            if (firstLink.length != 0){
                window.open(firstLink.attr('href'), firstLink.attr('target'));
            }

        } else if (event.keyCode == 38 || event.keyCode == 37){
            event.preventDefault();

            //向上 hover向前移动
            var allNode = $("#search_list a[display!='none']");
            var preNode = allNode.filter(".search-a-selected").prev();

            //console.log(allNode.length);
            //console.log("~" + allNode.filter(".search-a-selected").length);

            $('#search_list a').attr('class', 'search-a-select');
            if (preNode.length != 0) preNode.first().attr('class', 'search-a-selected');
            else allNode.first().attr('class', 'search-a-selected');




        } else if (event.keyCode == 40 || event.keyCode == 39){
            event.preventDefault();

            //向下 hover向后移动
            var allNode = $("#search_list a[display!='none']");
            var nextNode = allNode.filter(".search-a-selected").next();
            $('#search_list a').attr('class', 'search-a-select');
            if (nextNode.length != 0) nextNode.first().attr('class', 'search-a-selected');
            else allNode.first().attr('class', 'search-a-selected');

        } else if (! $('#search_input').is('focus')){
            $('#search_input').focus();
            setTimeout(function(){$('#search_input').change()},100);
        }
    });
});