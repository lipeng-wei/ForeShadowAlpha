var ForeSheet = {
    sheet 			: 	null,
    bodyScroll  	: 	null,
    tableScroll     :   null,
    calcPage 		: 	null,
    editor          :   null,
    filterDialog    :   null,
    filterExe       :   null,
    filterToDel     :   [],
    delRowS         :   [],
    favoritelet     :   null
}



$(function () {


    ForeSheet.bodyScroll = $("body").niceScroll({
        cursoropacitymax: 0.7,
        cursoropacitymin: 0.3,
        cursorborder: "2px solid #666666",
        cursorcolor: "#000000",
        cursorwidth: 5,
        cursorminheight: 56,
        horizrailenabled: false,
        enablekeyboard: false
    });
    //intro对话框设置
    $('.intro a').click(function(){
        $.dialog({
            title:'I n t r o',
            close: false,
            id:'IntroDialog',
            width: $(window).width() / 2,
            height: $(window).height() / 3 * 2,
            content:document.getElementById('intro-detail'),
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
                    type: 'wlp'
                }
            }
        });
    });

    //filter对话框中的Tab设置
    $('#filter-tab').easyResponsiveTabs({
        type: 'default', //Types: default, vertical, accordion
        width: 'auto', //auto or any width like 600px
        defaulttab: 1, // default tab
        fit: true, // 100% fit in a container
        tabidentify: 'filter-tab-id', // The tab groups identifier
        activetab_bg: '#333',
        inactive_bg: '#333',
        active_border_color: '#336666',
        active_content_border_color: '#336666',
        activate: function () {
            //编辑器页面更新
            $(this).text() == 'Search' && ForeSheet.editor && ForeSheet.editor.refresh();

            $('.nano').nanoScroller();
        }


    });

    //使用代码输入超炫特效
    POWERMODE.colorful = true;
    document.getElementById("filter-tab").addEventListener('input', POWERMODE);

    //编辑器初始化
    ForeSheet.editor = CodeMirror.fromTextArea(document.getElementById("program"), {
        scrollbarStyle: "simple",
        indentUnit: 4,
        theme: 'wlpstyle',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        continueComments: true
    });
    //编辑器内容变更 关闭过滤 按钮
    ForeSheet.editor.on('changes', function(){
        $('.exedebug').css('display', 'none');
        ForeSheet.filterDialog && ForeSheet.filterDialog.btn({           //this.btn ，dialog的方法成员
            filter:{         //设置disabled 按钮不可操作
                disabled: true
            }
        });
    });
    //事例部分的代码高亮
    CodeMirror.runMode(document.getElementById("example-input").value,
        "application/javascript",  document.getElementById("example-output")
    );
    //对话框不使用事隐藏
    $('#filter-tab').css('display', 'none');


    //自选股 管理/添加  管理对话框
    ForeSheet.favoritelet = function(){
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
    //加载数据表
    ForeSheet.sheet = $('#sheet').DataTable( {
        "search" 		: 	{
            "smart"	: 	false
        },
        columnDefs: [
            { width: '58px', targets: 0 }
        ],
        lengthChange 	: 	false,
        pageLength 		: 	18,
        autoWidth 		: 	true,
        foreTableI 		: 	'foreshadow',// new add  for  ID
        scrollY 		: 	false,
        scrollX 		: 	true,
        stateSave 		: 	true,
        stateDuration 	: 	0,//DataTables_
        select 			: 	{
            style 	: 	'os',
            items 	: 	'row'
        },
        "language": {
            "infoPostFix": ' <' + " Filtered and Deleted from " + $('#sheet tbody tr').length + ' entries'
        },
        "stateLoadParams": function (settings, data) {
            data.length = "";
            data.search.search = "";
            data.order = [];
            if (! data.editor) data.editor = '';
            if (ForeSheet.editor.doc)
                ForeSheet.editor.doc.setValue(data.editor);
        },
        "stateSaveParams": function (settings, data) {
            if (ForeSheet.editor.doc)
                data.editor = ForeSheet.editor.doc.getValue();
        },
        keys: {
            keys: [33, 34]
        },
        //按钮
        dom: 'Bfrtip',
        buttons: {
            buttons: [{
                text: 'Filter',
                action: function ( e, dt, node, config ) {

                    ForeSheet.filterDialog = $.dialog({
                        title:'F i l t e r',
                        close: false,
                        id:'FilterDialog',
                        width: $(window).width() / 2,
                        height: $(window).height() / 3 * 2,
                        content:document.getElementById('filter-tab'),
                        effect:'i-right-slide',
                        padding: '8px 18px 0 18px',
                        lock: true,
                        opacity: 0.58,
                        background: '#000',
                        fixed: true,
                        Esc: false,
                        show: function(){
                            ForeSheet.editor && ForeSheet.editor.refresh();
                        },
                        hide: function(){
                            ForeSheet.sheet && ForeSheet.sheet.state.save();
                            $('.exedebug').css('display', 'none');
                            this.btn({           //this.btn ，dialog的方法成员
                                filter:{         //设置disabled 按钮不可操作
                                    disabled: true
                                }
                            });
                        },
                        btn: {                      //可以任意定义按钮个数
                            run: {                     //按钮的key值，下次可用个btn方法从新设置
                                val: 'Run',            //按钮显示的文本
                                type: 'wlp',         //样式可选参数green, blue, red, yellow .默认白色。
                                click: function(){
                                    //console.log("Begin Filter ");
                                    ForeSheet.filterExe();
                                    $('.exedebug').css('display', 'block');
                                    return false;
                                }
                            },
                            filter: {
                                val: 'Filter',
                                type: 'wlp',
                                disabled: true,
                                click: function(){
                                    //console.info(ForeSheet.filterToDel);
                                    ForeSheet.sheet.rows(ForeSheet.filterToDel).remove().draw();
                                    ForeSheet.calcPage();
                                }
                            },
                            cancel:{
                                val: 'Cancel',
                                type: 'wlp'
                            }
                        }
                    });
                    ForeSheet.editor.refresh();

                }
            },{
                text: 'Delete',
                action: function ( e, dt, node, config ) {
                    dt.rows('.selected').remove().draw();
                    ForeSheet.calcPage();

                }
            },{
                text: 'Reload',
                action: function ( e, dt, node, config ) {
                    location.reload();
                }
            },{
                text: 'AddFav',
                action: function ( e, dt, node, config ) {
                    var data = [];
                    dt.rows('.selected').every(function(){
                        //console.info(this.data());
                        data.push({
                            'name': $(this.data()[0]).children('.fore-stock-name').text(),
                            'spell':$(this.data()[0]).children('.fore-stock-spell').text(),
                            'code': $(this.data()[1]).text()
                        });
                    });
                    //console.info('add',data);
                    ForeFavorite.operateData = data;
                    if (data.length > 0) ForeSheet.favoritelet();
                }
            },{
                text: 'Export',
                extend: 'collection',
                buttons: [
                    {
                        text: 'Excel',
                        action: function ( e, dt, node, config ) {
                            ForeSheet.sheetExport({
                                type:'Excel',
                                escape:false
                            });
                        }
                    },{
                        text: 'EBK',
                        action: function ( e, dt, node, config ) {
                            ForeSheet.sheetExport({
                                type:'EBK',
                                escape:false
                            });
                        }
                    },{
                        text: 'List',
                        action: function ( e, dt, node, config ) {
                            ForeSheet.sheetExport({
                                type:'List',
                                escape:false
                            });
                        }
                    },{
                        text: 'Table',
                        action: function ( e, dt, node, config ) {
                            ForeSheet.sheetExport({
                                type:'Table',
                                escape:false,
                                withHtml: true
                            });
                        }
                    }
                ]
            }],
            dom: {
                container: {
                    className: 'dt-buttons buttons-right'
                }
            }
        },

        fixedColumns 	: 	{
            leftColumns: 1
        }
    } );
    //设置数据表绘制的回调函数 更新各个滚动条 并置于底部
    ForeSheet.sheet.on( 'draw.dt', function () {

        ForeSheet.tableScroll = $(".dataTables_scrollBody").niceScroll({
            cursoropacitymax: 0.7,
            cursoropacitymin: 0.1,
            cursorborder: "2px solid #666666",
            cursorcolor: "#000000",
            cursorwidth: 5,
            cursorminheight: 56,
            horizrailenabled: true,
            enablekeyboard: false
        });
        ForeSheet.tableScroll.updateScrollBar(0);
        ForeSheet.tableScroll.checkContentSize();

        ForeSheet.bodyScroll.checkContentSize();
        ForeSheet.bodyScroll.doScrollBottom(0);

    } );
    //设置如果多选 为加入自选股 单选为自选股管理
    ForeSheet.sheet.on( 'select', function ( e, dt, type, indexes ) {
        //console.log(dt.rows('.selected').count());
        if (dt.rows('.selected').count() == 1) {
            ForeSheet.sheet.button(3).text('Favorite');
        } else {
            ForeSheet.sheet.button(3).text('AddFav');
        }

    } );
    //计算数据表每页显示行数
    ForeSheet.calcPage = function() {
        //根据浏览器的高度 设置每页长度
        //console.log('conheight: '+ $('.container').height());
        //console.log('page: '+ ForeSheet.sheet.page.info().length);
        //console.log('winheight: '+ $(window).height());
        var t = $('.DTFC_ScrollWrapper').height();
        var tt = ForeSheet.sheet.page.info();
        t = t / (tt.end - tt.start + 2);
        //console.log('winheight: '+ $(window).height());
        t = ($(window).height() - 108) / t;
        t = t > 2 ? Math.round(t) - 2 : 1;
        ForeSheet.sheet.page.len(t).draw();
    };
    $(window).resize(function(){
        setTimeout(function(){
            ForeSheet.calcPage();
        }, 588);
    });

    setTimeout(function(){
        ForeSheet.sheet.draw();
    }, 888);
    setTimeout(function(){
        ForeSheet.calcPage();
    }, 888);


});
//Fiter Run的功能函数
ForeSheet.filterExe = function(){
    if (ForeSheet.editor && ForeSheet.editor.doc.getValue()){
        var userScript = '(function(){' + ForeSheet.editor.doc.getValue() + '})();';
        var errType = 'ForeShow Platform Error';
        var errName = '';
        var errMess = '';
        ForeSheet.filterToDel = [];
        try  {
            ForeSheet.sheet.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                var data = this.data();
                //console.log(rowIdx);
                //console.info(data);

                for(var i=0; i<data.length; i++){
                    var Tvar = '$' + String.fromCharCode(65 + i);
                    var Tval = isNaN(data[i]) ? data[i] : parseFloat(data[i]);
                    var Tstr = 'var ' + Tvar + ' = Tval ;';
                    eval(Tstr);
                };
                errType = 'Coding Error';
                var result = eval(userScript);
                errType = 'ForeShow Platform Error';

                if (result === true){}
                else if (result === false) {
                    ForeSheet.filterToDel.push(rowIdx);
                } else {
                    errType = 'Coding Error';
                    errName = 'ReturnMissing';
                    errMess = 'Must return "true" Or "false" To Filter';
                }

            } );
        } catch(exception) {
            errName = exception.name;
            errMess = exception.message;
            //console.info(exception);
        }

    } else {
        errType = 'Coding Error';
        errName = 'ReturnMissing';
        errMess = 'Must return "true" Or "false" To Filter';
    };
    var errText = errType + "[" + errName + "]:" + errMess;

    if (errName) {
        if (errType == 'Coding Error') {
            $('.exedebug').css('color', 'red').text(errText);
        } else {
            $('.exedebug').css('color', '#336666').text(errText);
        }
    } else {
        $('.exedebug').css('color', 'green').text('Filter OK ! ' +
            (ForeSheet.sheet.rows().count() - ForeSheet.filterToDel.length) +
            ' Matched In ' + ForeSheet.sheet.rows().count() + 'Rows'
        );
        ForeSheet.filterDialog && ForeSheet.filterDialog.btn({           //this.btn ，dialog的方法成员
            filter:{         //设置disabled 按钮可操作
                disabled: false
            }
        });
    }

}

ForeSheet.sheetExport = function(options) {
    var defaults = {
        type: 'List',//EBK Excel List Table Copy
        ignoreColumn: [],
        escape: false,
        withHtml: false
    };
    var sheet = ForeSheet.sheet;


    $.base64.utf8encode = true;
    options = $.extend(defaults, options);

    if (options.type == 'EBK') {
        var Tt = ForeSheet.sheet.column(1).data();
        $.each(Tt, function(idx){
            Tt[idx] = code2EBK(parseString($(Tt[idx])));
        });
        var excelFile = Tt.join("\r\n");
        var base64data = "base64," + $.base64.encode(excelFile);
        var content = 'data:application/txt;' + base64data;
        var filename = getFilePrefix() + '.EBK';
        downloadFile(filename, content);

    } else if (options.type == 'List') {
        var selectColumn = [0, 1];
        var Tt = [];
        // Header
        var Tr = [];
        $(sheet.header()).find('tr').each(function () {
            $(this).find('th').each(function (index, data) {
                if (selectColumn.indexOf(index) != -1) {
                    Tr.push(parseString($(this)));
                }

            });
        });
        Tt.push(Tr.join('|'));
        // Body
        sheet.rows().every( function ( rowIdx ) {
            var data = this.data();
            Tr = [];
            for(var i=0; i<data.length; i++){
                if (selectColumn.indexOf(i) != -1) {
                    var st = $('<td></td>').append(data[i]).find('a span:first-child');
                    st = st.length > 0 ? parseString(st) :  parseString($(data[i]));
                    Tr.push(st);
                }
            };
            Tt.push(Tr.join('|'));
        } );
        var excelFile = Tt.join("\r\n");
        var base64data = "base64," + $.base64.encode(excelFile);
        var content = 'data:application/txt;' + base64data;
        var filename = getFilePrefix() + '.List.txt';
        downloadFile(filename, content);

    } else if (options.type == 'Table') {
        var Tt = [];
        // Header
        var Tr = [];
        $(sheet.header()).find('tr').each(function () {
            $(this).filter(':visible').find('th').each(function (index, data) {
                if ($(this).css('display') != 'none') {
                    if (options.ignoreColumn.indexOf(index) == -1) {
                        Tr.push(parseString($(this)));
                    }
                }
            });
        });
        Tt.push(Tr.join('|'));
        // Body
        sheet.rows().every( function ( rowIdx ) {
            var data = this.data();
            Tr = [];
            for(var i=0; i<data.length; i++){
                if (options.ignoreColumn.indexOf(i) == -1) {
                    Tr.push(parseString($('<td></td>').append(data[i])));
                }
            };
            Tt.push(Tr.join('|'));
        } );
        var excelFile = Tt.join("\r\n");
        var base64data = "base64," + $.base64.encode(excelFile);
        var content = 'data:application/txt;' + base64data;
        var filename = getFilePrefix() + '.Table.txt';
        downloadFile(filename, content);

    } else if (options.type == 'Excel') {
        var excel = "<table>";
        // Header
        $(sheet.header()).find('tr').each(function () {
            excel += "<tr>";
            $(this).filter(':visible').find('th').each(function (index, data) {
                if ($(this).css('display') != 'none') {
                    if (options.ignoreColumn.indexOf(index) == -1) {
                        excel += "<td>" + parseString($(this)) + "</td>";
                    }
                }
            });
            excel += '</tr>';
        });
        // Body
        sheet.rows().every( function ( rowIdx ) {
            excel += "<tr>";
            var data = this.data();
            excel += "<td>" + parseString($(data[0]).children('.fore-stock-name')) +
                "(" +  parseString($(data[0]).children('.fore-stock-spell')) + ")</td>";
            for(var i=1; i<data.length; i++){
                if (options.ignoreColumn.indexOf(i) == -1) {

                    excel += "<td>" + parseString($('<td></td>').append(data[i])) + "</td>";
                }
            };
            excel += '</tr>';
        } );
        excel += '</table>';
        //console.log(excel);

        var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:"
            + options.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
        excelFile += "<head>";
        excelFile += "<!--[if gte mso 9]>";
        excelFile += "<xml>";
        excelFile += "<x:ExcelWorkbook>";
        excelFile += "<x:ExcelWorksheets>";
        excelFile += "<x:ExcelWorksheet>";
        excelFile += "<x:Name>";
        excelFile += "{worksheet}";
        excelFile += "</x:Name>";
        excelFile += "<x:WorksheetOptions>";
        excelFile += "<x:DisplayGridlines/>";
        excelFile += "</x:WorksheetOptions>";
        excelFile += "</x:ExcelWorksheet>";
        excelFile += "</x:ExcelWorksheets>";
        excelFile += "</x:ExcelWorkbook>";
        excelFile += "</xml>";
        excelFile += "<![endif]-->";
        excelFile += "</head>";
        excelFile += "<body>";
        excelFile += excel;
        excelFile += "</body>";
        excelFile += "</html>";

        var base64data = "base64," + $.base64.encode(excelFile);
        var content = 'data:application/vnd.ms-excel;' + base64data;
        var filename = getFilePrefix() + '.Excel.xls';
        downloadFile(filename, content);
    }

    function parseString(data) {
        if (options.withHtml) {
            content_data = data.html().trim();
        } else {
            content_data = data.text().trim();
        }
        if (options.escape) {
            content_data = escape(content_data);
        }
        return content_data;
    }
    function downloadFile(filename, data){
        var downLink = $('#downLink');
        if (downLink.length < 1){
            $('<a id="downLink" style="display: none"></a>').appendTo($('body'));
        }
        downLink = document.getElementById('downLink');
        //window.open('data:application/vnd.ms-excel;filename=export.xls;name=export.xls;' + base64data);
        downLink.download = filename;
        downLink.href = data;
        downLink.click();
    }
    function getFilePrefix() {
        var name = 'table';
        var prefix = "ForeShadow_export";

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r && r[2]) prefix = unescape(r[2]);

        if (prefix.substr(prefix.length-4).toLowerCase() == '.txt') prefix = prefix.substr(0, prefix.length-4);
        if (prefix.substr(prefix.length-5).toLowerCase() == '.list') prefix = prefix.substr(0, prefix.length-5);
        if (prefix.substr(prefix.length-6).toLowerCase() == '.table') prefix = prefix.substr(0, prefix.length-6);
        return  prefix;
    }
    function code2EBK(st) {
        if (st.substr(0, 2).toLowerCase() == 'sh') return '1' + st.substr(2);
        if (st.substr(0, 2).toLowerCase() == 'sz') return '0' + st.substr(2);

    }
}
