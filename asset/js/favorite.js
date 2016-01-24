$.extend(ForeFavorite, {
    sheet 			: 	null,
    bodyScroll  	: 	null,
    tableScroll     :   null,
    hash            :   null,
    categoryCheckBox:   null,
    favoritelet     :   null,
    calcPage 		: 	null
});

$(function () {

    ForeFavorite.bodyScroll = $("body").niceScroll({
        cursoropacitymax: 0.7,
        cursoropacitymin: 0.3,
        cursorborder: "2px solid #666666",
        cursorcolor: "#000000",
        cursorwidth: 5,
        cursorminheight: 56,
        horizrailenabled: false,
        enablekeyboard: false
    });

    ForeFavorite.categoryCheckBox = function(){
        $('#favor-manage-checkbox').empty();
        var html = '';
        var cates = ForeFavorite.getIndex();
        /*
        cates = ['test','123','fefwdedwedwedewdwe','dwe','dwedwe','frgrgr'
            ,'123','fefwdedwedwedewdwe','dwe','dwedwe','frgrgr'
            ,'123','fefwdedwedwedewdwe','dwe','dwedwe','frgrgr'
            ,'123','fefwdedwedwedewdwe','dwe','dwedwe','frgrgr'
            ,'123','fefwdedwedwedewdwe','dwe','dwedwe','frgrgr'];
        */
        for(var i in cates){
            var c = ' ind="' + i + '">' + cates[i] + '</a>';
            if(ForeFavorite.hash == i){
                c = '<a class="a-select a-selected"' + c;
                $('#favor-manage-name').attr('value', cates[i]);
            } else
                c = '<a class="a-select"' + c;
            html += c;
        }
        $('#favor-manage-checkbox').append(html);
        $('.nano').nanoScroller();

        $('#favor-manage-checkbox .a-select').click(function(){
            $('#favor-manage-checkbox .a-select').removeClass('a-selected');
            $(this).addClass('a-selected');
            location.hash = $(this).attr('ind');
            $('#favor-manage-name').val($(this).text());
        });
    }

    $('#favor-manage-add').click(function(){
        var name = $('#favor-manage-name').val().trim();
        if (! name) return false;
        ForeFavorite.addCategory(name);
        location.hash == '#0'? $(window).hashchange() : (location.hash = '#0');
        ForeFavorite.hash = 0;
        ForeFavorite.categoryCheckBox();
    });
    $('#favor-manage-del').click(function(){
        var name = $('#favor-manage-checkbox .a-selected');
        if (name.leng < 1) return false;
        name = name.text();
        ForeFavorite.delCategory(name);
        location.hash == ''? $(window).hashchange() : (location.hash = '');
        ForeFavorite.hash = '-1';
        ForeFavorite.categoryCheckBox();
    });
    $('#favor-manage-rename').click(function(){
        var oldName = $('#favor-manage-checkbox .a-selected');
        var newName = $('#favor-manage-name').val().trim();
        if (! newName || oldName.leng < 1) return false;
        oldName = oldName.text();
        ForeFavorite.updateCategory(oldName, newName);
        location.hash == '#0'? $(window).hashchange() : (location.hash = '#0');
        ForeFavorite.hash = 0;
        ForeFavorite.categoryCheckBox();
    });

    $(window).hashchange( function(){
        var hash = location.hash.substr(1);
        hash = isNaN(hash)? -1: parseInt(hash);
        ForeFavorite.hash = hash;

        $('#category').text('');
        if (ForeFavorite.sheet) {
            ForeFavorite.sheet.destroy();
            $('.container').empty(); // empty in case the columns change
        }

        if (! ForeFavorite.getCategory(hash)) return true;

        $('#category').text(ForeFavorite.getCategory(hash));
        var favData = ForeFavorite.getFavoriteHtml(ForeFavorite.getCategory(hash));
        var favColumn = ForeFavorite.getColmnFavorite();
        var tHead = '<thead><tr>';
        var tBody = '<tbody><tr>';
        for(var i in favColumn){
            tHead +='<th>'+ favColumn[i].title + '</th>';
            tBody +='<td>'+ favColumn[i].title + '</td>';
        }
        tHead += '</tr></thead>';
        tBody += '</tr></tbody>';
        $('<table id="sheet" class="display compact cell-border" cellspacing="0" width="100%"></table>').appendTo($('.container'))
            .append(tHead).append(tBody);

        //console.info(hisData);
        //加载数据表
        ForeFavorite.sheet = $('#sheet').DataTable( {
            columns 		: 	favColumn,
            data 			:   favData,
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
                        if (data.length > 0) ForeFavorite.favoritelet(data);
                    }
                },{
                    text: 'Delete',
                    action: function ( e, dt, node, config ) {
                        dt.rows('.selected').every(function() {
                            var data = this.data();
                            data = $('<div></div>').append(data['code']).text().trim();
                            ForeFavorite.delFavorite({code:data}, ForeFavorite.getCategory(hash));
                        });
                        dt.rows('.selected').remove().draw();
                        ForeFavorite.calcPage();
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
        ForeFavorite.sheet.on( 'draw.dt', function () {
            ForeFavorite.bodyScroll.checkContentSize();
            ForeFavorite.bodyScroll.doScrollBottom(0);

        } );
        //设置如果多选 为加入自选股 单选为自选股管理
        ForeFavorite.sheet.on( 'select', function ( e, dt, type, indexes ) {
            //console.log(dt.rows('.selected').count());
            if (dt.rows('.selected').count() == 1) {
                ForeFavorite.sheet.button(0).text('Favorite');
            } else {
                ForeFavorite.sheet.button(0).text('AddFav');
            }

        } );
        setTimeout(function(){
            ForeFavorite.calcPage();
        }, 888);

    });
    //计算数据表每页显示行数
    ForeFavorite.calcPage = function() {
        //根据浏览器的高度 设置每页长度
        //console.log('conheight: '+ $('.container').height());
        //console.log('page: '+ ForeFavorite.sheet.page.info().length);
        //console.log('winheight: '+ $(window).height());
        var t = $('#sheet').height();
        var tt = ForeFavorite.sheet.page.info();
        t = t / (tt.end - tt.start + 1);
        //console.log('winheight: '+ $(window).height());
        t = ($(window).height() - 108) / t;
        t = t > 1 ? Math.round(t) - 1 : 1;
        ForeFavorite.sheet.page.len(t).draw();
    };
    $(window).resize(function(){
        setTimeout(function(){
            ForeFavorite.calcPage();
        }, 588);
    });

    //自选股整体和分类管理 对话框中的Tab设置
    $('#favor-manage').easyResponsiveTabs({
        type: 'default', //Types: default, vertical, accordion
        width: 'auto', //auto or any width like 600px
        defaulttab: 1, // default tab
        fit: true, // 100% fit in a container
        tabidentify: 'favor-manage-tab-id', // The tab groups identifier
        activetab_bg: '#333',
        inactive_bg: '#333',
        active_border_color: '#336666',
        active_content_border_color: '#336666',
        activate: function () {
            ForeFavorite.categoryCheckBox();
        }

    });
    //对话框不使用事隐藏
    $('#favor-manage').css('display', 'none');

    $('#favor').click(function(){
        $.dialog({
            title:'M a n a g e',
            close: false,
            id:'favorManageDialog',
            width: $(window).width() / 2,
            height: $(window).height() / 3 * 2,
            content:document.getElementById('favor-manage'),
            effect:'i-top-slide',
            padding: '8px 18px 0 18px',
            lock: true,
            opacity: 0.58,
            background: '#000',
            fixed: true,
            Esc: false,
            shown: function(){
                ForeFavorite.categoryCheckBox();
                $('.nano').nanoScroller();
            },
            btn: {                      //可以任意定义按钮个数
                ok: {                     //按钮的key值，下次可用个btn方法从新设置
                    val: 'OK',            //按钮显示的文本
                    type: 'wlp'
                }
            }
        });
    });
    //自选股 管理/添加  管理对话框
    ForeFavorite.favoritelet = function(){
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
                            location.reload();
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
