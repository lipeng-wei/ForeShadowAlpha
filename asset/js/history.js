
$.extend(ForeHistory, {
    sheet 			: 	null,
    bodyScroll  	: 	null,
    tableScroll     :   null,
    hash            :   null,
    favoritelet     :   null,
    calcPage 		: 	null
});

$(function () {

    ForeHistory.bodyScroll = $("body").niceScroll({
        cursoropacitymax: 0.7,
        cursoropacitymin: 0.3,
        cursorborder: "2px solid #666666",
        cursorcolor: "#000000",
        cursorwidth: 5,
        cursorminheight: 56,
        horizrailenabled: false,
        enablekeyboard: false
    });

    $(window).hashchange( function(){
        var hash = location.hash.substr(1);
        hash = ! hash || isNaN(hash)? 0: parseInt(hash);
        ForeHistory.hash = hash;

        if (ForeHistory.sheet) {
            ForeHistory.sheet.destroy();
            $('.container').empty(); // empty in case the columns change
        }

        $('#timeline').text(ForeHistory.getTimeLine(hash));
        var hisData = ForeHistory.getTimeHistory(hash);
        var hisColumn = ForeHistory.getColmnHistory();
        var tHead = '<thead><tr>';
        var tBody = '<tbody><tr>';
        for(var i in hisColumn){
            tHead +='<th>'+ hisColumn[i].title + '</th>';
            tBody +='<td>'+ hisColumn[i].title + '</td>';
        }
        tHead += '</tr></thead>';
        tBody += '</tr></tbody>';
        $('<table id="sheet" class="display compact cell-border" cellspacing="0" width="100%"></table>').appendTo($('.container'))
            .append(tHead).append(tBody);

        //console.info(hisData);
        //加载数据表
        ForeHistory.sheet = $('#sheet').DataTable( {
            columns 		: 	hisColumn,
            data 			:   hisData,
            "search" 		: 	{
                "smart"	: 	false
            },
            "order"         :   [[ 2, "desc" ]],
            lengthChange 	: 	false,
            pageLength 		: 	18,
            autoWidth 		: 	true,
            foreTableI 		: 	'foreshadow',// new add  for  ID
            select 			: 	{
                style 	: 	'os',
                items 	: 	'row'
            },
            keys: {
                keys: [33, 34]
            },
            //按钮
            dom: 'Bfrtip',
            buttons: {
                buttons: [{
                    text: 'AddFav',
                    action: function ( e, dt, node, config ) {
                        var data = [];
                        dt.rows('.selected').every(function(){
                            //console.info(this.data());
                            data.push({
                                'name': $(this.data()['name']).children('.fore-stock-name').text(),
                                'spell':$(this.data()['name']).children('.fore-stock-spell').text(),
                                'code': $(this.data()['code']).text()
                            });
                        });
                        //console.info('add',data);
                        ForeFavorite.operateData = data;
                        if (data.length > 0) ForeHistory.favoritelet(data);
                    }
                },{
                    text: 'Delete',
                    action: function ( e, dt, node, config ) {
                        dt.rows('.selected').every(function() {
                            var data = this.data();
                            data = $('<div></div>').append(data['code']).text().trim();
                            ForeHistory.delTimeHistory(hash, data);
                        });
                        dt.rows('.selected').remove().draw();
                        ForeHistory.calcPage();
                    }
                },{
                    text: 'Reload',

                    action: function ( e, dt, node, config ) {
                        location.reload();
                    }
                }],
                dom: {
                    container: {
                        className: 'dt-buttons buttons-right'
                    }
                }
            }
        } );
        //设置数据表绘制的回调函数 更新各个滚动条 并置于底部
        ForeHistory.sheet.on( 'draw.dt', function () {
            ForeHistory.bodyScroll.checkContentSize();
            ForeHistory.bodyScroll.doScrollBottom(0);

        } );
        //设置如果多选 为加入自选股 单选为自选股管理
        ForeHistory.sheet.on( 'select', function ( e, dt, type, indexes ) {
            //console.log(dt.rows('.selected').count());
            if (dt.rows('.selected').count() == 1) {
                ForeHistory.sheet.button(0).text('Favorite');
            } else {
                ForeHistory.sheet.button(0).text('AddFav');
            }

        } );
        setTimeout(function(){
            ForeHistory.calcPage();
        }, 888);

    });
    //计算数据表每页显示行数
    ForeHistory.calcPage = function() {
        //根据浏览器的高度 设置每页长度
        //console.log('conheight: '+ $('.container').height());
        //console.log('page: '+ ForeHistory.sheet.page.info().length);
        //console.log('winheight: '+ $(window).height());
        var t = $('#sheet').height();
        var tt = ForeHistory.sheet.page.info();
        t = t / (tt.end - tt.start + 1);
        //console.log('winheight: '+ $(window).height());
        t = ($(window).height() - 108) / t;
        t = t > 1 ? Math.round(t) - 1 : 1;
        ForeHistory.sheet.page.len(t).draw();
    };
    $(window).resize(function(){
        setTimeout(function(){
            ForeHistory.calcPage();
        }, 588);
    });
    //自选股 管理/添加  管理对话框
    ForeHistory.favoritelet = function(){
        var updateBox= function(){
            var data = ForeFavorite.operateData;
            $('#favoritelet-box').empty();
            var html = '';
            var cates = ForeFavorite.getIndex();
            var favorCates = [];
            if(data.length == 1) {
                //添加已经加入的自选股版块
                favorCates = ForeFavorite.getFavoriteCategory(data[0]);
                for( var i in favorCates){
                    html += '<a class="a-select a-selected">' + favorCates[i] + '</a>';
                }
            }
            for(var i in cates){
                if (favorCates.indexOf(cates[i]) == -1){
                    html += '<a class="a-select">' + cates[i] + '</a>';
                }
            }
            $('#favoritelet-box').append(html);
            $('#favoritelet-box .a-select').click(function(){
                if (data.length == 1) {
                    $(this).toggleClass('a-selected');
                } else {
                    $('#favoritelet-box .a-select').removeClass('a-selected');
                    $(this).addClass('a-selected');
                }
            });
        };

        //自选股管理中的添加分类按钮
        $('#favoritelet-add').unbind();
        $('#favoritelet-add').click(function(){
            var name = $('#favoritelet-name').val().trim();
            if (! name) return false;
            ForeFavorite.addCategory(name);
            updateBox();
            $('.nano').nanoScroller();
        });


        updateBox();
        $.dialog({
            title:'F a v o r i t e',
            close: false,
            id:'FavoriteletDialog',
            width: $(window).width() / 2,
            height: $(window).height() / 3 * 2,
            content:document.getElementById('favoritelet'),
            effect:'i-top-slide',
            padding: '8px 18px 0 18px',
            lock: true,
            opacity: 0.58,
            background: '#000',
            fixed: true,
            Esc: false,
            shown: function(){

                $('.nano').nanoScroller();
            },
            btn: {                      //可以任意定义按钮个数
                ok: {                     //按钮的key值，下次可用个btn方法从新设置
                    val: 'OK',            //按钮显示的文本
                    type: 'wlp',
                    click: function(){
                        var data = ForeFavorite.operateData;
                        if (data.length == 1) {
                            $('#favoritelet-box .a-select').each(function(){
                                if ($(this).hasClass('a-selected')){
                                    //console.log($(this).text());
                                    ForeFavorite.addFavorite(data[0], [$(this).text()]);
                                } else {
                                    ForeFavorite.delFavorite(data[0], $(this).text());
                                }
                            });
                        } else {
                            $('#favoritelet-box .a-select').each(function(){
                                if ($(this).hasClass('a-selected')){
                                    for(var i in data){
                                        ForeFavorite.addFavorite(data[i], [$(this).text()]);
                                    }
                                } else {
                                    for(var i in data){
                                        ForeFavorite.delFavorite(data[i], $(this).text());
                                    }
                                }
                            });
                        }
                    }
                },
                cancel:{
                    val: 'Cancel',
                    type: 'wlp'
                }
            }
        });
    }

    // 触发首次进入页面 根据hash加载
    $(window).hashchange();
});
