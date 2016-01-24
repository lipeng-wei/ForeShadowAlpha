/**
 * Created by lipeng_wei on 15-7-13.
 */



function FORMATBIGINT(data){
    var i = 0, label = ['万', '亿', '万亿', '亿亿'];
    for (i=0; i<label.length; i++){
        if (data<Math.pow(10000, i+1)) break;
    }
    if (i == 0) return data;
    var f = Math.round(data/Math.pow(10000, i)*1000)/1000;
    return '' + f + label[i-1];
}
function PARSENUMBER(str){
    if (str == "") return null;
    else return parseFloat(str);
}

$(function () {

    //console.log(Date.parse('Wed Jul 01 00:00:00 +0800 2015'));
    stock['data'] = {};
    for(var k in stock['rawdata']) {
        stock['data'][k] ={
            ohlc: [],
            volume: [],
            ma5: [],
            ma10: [],
            ma20: [],
            ma30: [],
            ma60: [],
            dif: [],
            dea: [],
            macd: []
        };

        var tdata = stock['rawdata'][k];
        for (var i = 0; i < tdata.length; i++) {

            var time = Date.parse(tdata[i]['time']);

            //把获取的数据放入ohlc 中
            stock['data'][k]['ohlc'].push([
                time, // the date
                PARSENUMBER(tdata[i]['open']), // open
                PARSENUMBER(tdata[i]['high']), // high
                PARSENUMBER(tdata[i]['low']), // low
                PARSENUMBER(tdata[i]['close']) // close
            ]);
            stock['data'][k]['volume'].push([
                time, // date
                PARSENUMBER(tdata[i]['volume']) // volume
            ]);
            stock['data'][k]['ma5'].push([
                time, // date
                PARSENUMBER(tdata[i]['ma5']) // ma5
            ]);
            stock['data'][k]['ma10'].push([
                time, // date
                PARSENUMBER(tdata[i]['ma10']) // ma10
            ]);
            stock['data'][k]['ma20'].push([
                time, // date
                PARSENUMBER(tdata[i]['ma20']) // ma20
            ]);
            stock['data'][k]['ma30'].push([
                time, // date
                PARSENUMBER(tdata[i]['ma30']) // ma30
            ]);
            stock['data'][k]['ma60'].push([
                time, // date
                PARSENUMBER(tdata[i]['ma60']) // ma60
            ]);
            stock['data'][k]['dif'].push([
                time, // date
                PARSENUMBER(tdata[i]['dif']) // dif
            ]);
            stock['data'][k]['dea'].push([
                time, // date
                PARSENUMBER(tdata[i]['dea']) // dea
            ]);
            stock['data'][k]['macd'].push([
                time, // date
                PARSENUMBER(tdata[i]['macd']) // macd

            ]);
        }
    }

    function getSeriesData(series){
        return stock.data[stock.right][series];
    }

    function getGbbqData(){
        var gbbq = [];
        for(var i = 0; i < stock['gbbq'].length; i++){
            //console.log(Date.parse(stock['gbbq'][i]['time']));
            gbbq.push({
                x : Date.parse(stock['gbbq'][i]['time']),
                title : stock['gbbq'][i]['label']

            });
        }
        return gbbq;
    }
    function setSeriesData(){
        //console.log(stock.right);
        var chart = $('#container').highcharts();
        var series = chart.series
        while(series.length > 0) {

            series[0].remove(false);

        }
        //chart.redraw();
        var sd = [{
            name: 'ohlc',
            data: getSeriesData('ohlc'),
            type: 'candlestick',
            yAxis: 0,
            dataGrouping: {
                enabled:false
            }
        },{
            type: 'column',
            name: 'volume',
            data: getSeriesData('volume'),
            yAxis: 1,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma5',
            data: getSeriesData('ma5'),
            type: 'spline',
            yAxis: 0,
            color: 'white',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma10',
            data: getSeriesData('ma10'),
            type: 'spline',
            yAxis: 0,
            color: 'yellow',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma20',
            data: getSeriesData('ma20'),
            type: 'spline',
            yAxis: 0,
            color: 'purple',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma30',
            data: getSeriesData('ma30'),
            type: 'spline',
            yAxis: 0,
            color: 'blue',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma60',
            data: getSeriesData('ma60'),
            type: 'spline',
            yAxis: 0,
            color: 'darkgreen',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'macd',
            data: getSeriesData('macd'),
            type: 'column',
            yAxis: 2,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'dif',
            data: getSeriesData('dif'),
            type: 'spline',
            yAxis: 2,
            color: 'white',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'dea',
            data: getSeriesData('dea'),
            type: 'spline',
            yAxis: 2,
            color: 'yellow',
            dataGrouping: {
                enabled:false
            }
        },{
            name : 'gbbq',
            data : getGbbqData(),
            type : 'flags',
            shape : 'squarepin',
            color : 'grey',
            fillColor : 'black',
            style: {
                color : 'grey'
            }
        }];

        for(var i=0; i<sd.length; i++)
            chart.addSeries(sd[i], false);
        chart.redraw();
    }


    Highcharts.setOptions({
        global : {
            useUTC : false
        },
        lang: {
            rangeSelectorZoom: "",
            loading:'加载中...'
        }
    });



    //修改colum条的颜色（重写了源码方法）
    var originalDrawPoints = Highcharts.seriesTypes.column.prototype.drawPoints;
    Highcharts.seriesTypes.column.prototype.drawPoints = function () {
        var merge  = Highcharts.merge,
            series = this,
            chart  = this.chart,
            points = series.points,
            i      = points.length;

        //console.log(series.name);
        if (series.name == "volume") {
            while (i--) {
                var candlePoint = chart.series[0].points[i];
                var prevClose = (i == 0) ? 0 : chart.series[0].points[i-1].close;
                if(candlePoint.close != undefined && prevClose !=  undefined){  //如果是K线图 改变矩形条颜色，否则不变
                    var color = (candlePoint.close >= prevClose) ? 'red' : 'cyan';
                    var seriesPointAttr = merge(series.pointAttr);

                    seriesPointAttr[''].fill = color;
                    seriesPointAttr.hover.fill = color;
                    seriesPointAttr.select.fill = color;

                }else{
                    var seriesPointAttr = merge(series.pointAttr);
                }

                points[i].pointAttr = seriesPointAttr;
            }
        }
        if (series.name == "macd") {
            while (i--) {
                var candlePoint = chart.series[0].points[i];
                var macdPoint = chart.series[7].points[i];
                if(candlePoint.close != undefined ){  //如果是K线图 改变矩形条颜色，否则不变
                    var color = (macdPoint.y >= 0) ? 'red' : 'cyan';
                    var seriesPointAttr = merge(series.pointAttr);

                    seriesPointAttr[''].fill = color;
                    seriesPointAttr.hover.fill = color;
                    seriesPointAttr.select.fill = color;

                }else{
                    var seriesPointAttr = merge(series.pointAttr);
                }

                points[i].pointAttr = seriesPointAttr;
            }
        }


        originalDrawPoints.call(this);
    };

    // 创建图表
    $('#container').highcharts('StockChart', {

        chart: {
            height: $(window).height(),
            backgroundColor: 'black',
            zoomType: "x"

        },


        /**
         * 气泡示说明标签
         *
         * @param {string} xDateFormat 日期时间格式化
         */
        tooltip: {
            valueDecimals: 2,
            backgroundColor: '#7D7D7D',
            borderColor: '#B22222',
            borderWidth: 1,
            borderRadius: 6,
            crosshairs: [true,true],
            shadow: false,
            style: {
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'normal',
                padding: '8px'
            },
            useHTML: true,

            formatter: function () {
                if(this.y == undefined){
                    return;
                }
                var i;
                for(i =0; i<stock.data[stock.right].ohlc.length;i++){
                    if(this.x == stock.data[stock.right].ohlc[i][0]) break;
                }
                relativeWidth = (this.points[0].point.shapeArgs)?
                    this.points[0].point.shapeArgs.x : relativeWidth;
                var lastClose = (stock.data[stock.right].ohlc[i-1] && stock.data[stock.right].ohlc[i-1][4])?
                    stock.data[stock.right].ohlc[i-1][4] : false;
                var c1 = (lastClose == false || lastClose <= stock.data[stock.right].ohlc[i][4])? 'red' : 'cyan';
                //股票名
                var str = '<span style="font-size:18px;font-weight: bold;color:' + c1 + ';">' + stock["name"] + '</span><br/>';
                //时间
                str += '时间：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    Highcharts.dateFormat('%Y-%m-%d', this.x) + '</span><br/>';
                //开盘价
                var c2 = (lastClose == false || lastClose <= stock.data[stock.right].ohlc[i][1])? 'red' : 'cyan';
                str += '开盘：' + '<span style="font-weight: bold;color:' + c2 + ';">' +
                    this.points[0].point.open + '</span><br/>';
                //最高价
                c2 = (lastClose == false || lastClose <= stock.data[stock.right].ohlc[i][2])? 'red' : 'cyan';
                str += '最高：' + '<span style="font-weight: bold;color:' + c2 + ';">' +
                    this.points[0].point.high + '</span><br/>';
                //最低价
                c2 = (lastClose == false || lastClose <= stock.data[stock.right].ohlc[i][3])? 'red' : 'cyan';
                str += '最低：' + '<span style="font-weight: bold;color:' + c2 + ';">' +
                    this.points[0].point.low + '</span><br/>';
                //收盘价
                str += '收盘：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    this.points[0].point.close + '</span><br/>';
                //昨天收盘价
                if (lastClose) str += '昨收：' + lastClose + '<br/>';
                //涨额
                if (lastClose) str += '涨额：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    stock['rawdata'][stock.right][i].chg + '(' + stock['rawdata'][stock.right][i].percent + '%)</span><br/>';
                //涨幅
                if (lastClose) str += '涨幅：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    Math.floor((stock.data[stock.right].ohlc[i][4]-lastClose)*10000/lastClose)/100 + '%</span><br/>';
                //成交数
                if (this.points[1]) str += '成交（手）：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    FORMATBIGINT(this.points[1].y) + '</span><br/>';
                //换手率
                if (lastClose) str += '换手率：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    stock['rawdata'][stock.right][i].turnrate + '%</span><br/>';

                //MA5
                if (this.points[2]) str += '<span style="color:white;">MA5:' +
                    Math.round(this.points[2].y * 100) / 100 + '</span><br/>';
                //MA10
                if (this.points[3]) str += '<span style="color:yellow;">MA10:' +
                    Math.round(this.points[3].y * 100) / 100 + '</span><br/>';
                //MA20
                if (this.points[4]) str += '<span style="color:purple;">MA20:' +
                    Math.round(this.points[4].y * 100) / 100 + '</span><br/>';
                //MA30
                if (this.points[5]) str += '<span style="color:blue;">MA30:' +
                    Math.round(this.points[5].y * 100) / 100 + '</span><br/>';
                //MA60
                if (this.points[6]) str += '<span style="color:darkgreen;">MA60:' +
                    Math.round(this.points[6].y * 100) / 100 + '</span><br/>';

                //DIF
                if (this.points[8]) str += '<span style="color:white;">DIF:' +
                    Math.round(this.points[8].y * 100) / 100 + '</span><br/>';
                //DEA
                if (this.points[9]) str += '<span style="color:yellow;">DEA:' +
                    Math.round(this.points[9].y * 100) / 100 + '</span><br/>';
                //MACD
                if (this.points[7]) str += '<span style="color:cyan;">MACD:' +
                    Math.round(this.points[7].y * 100) / 100 + '</span><br/>';


                return str;
            },
            positioner: function () { //设置tips显示的相对位置
                var halfWidth = this.chart.chartWidth/2;//chart宽度
                var width = this.chart.chartWidth-198;
                var height = this.chart.chartHeight/8;//chart高度
                if(relativeWidth<halfWidth){
                    return { x: width, y:height };
                }else{
                    return { x: 18, y: height };
                }
            }
        },
        plotOptions: {
            candlestick: {
                //cursor: "pointer",
                color: 'cyan',
                upColor: 'black',
                lineColor: 'cyan',
                upLineColor: 'red',
                flatLineColor: 'white',
                maker:{
                    states:{
                        hover:{
                            enabled:false
                        }
                    }
                }
            },
            spline: {
                lineWidth: 1
            },
            series: {
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            column: {
                colorByPoint: false
            }

        },

        exporting: {
            enabled: false  //设置导出按钮不可用
        },
        credits: {
            enabled: false  //去除右下角logo
        },
        rangeSelector: {
            enabled: true,
            selected: 1,
            inputEnabled: true,
            inputBoxBorderColor: 'grey',
            inputPosition: {
                align: 'left',
                y: 13,
                x: 688
            },
            inputStyle:{
                'font-size': 2
            },
            buttonPosition: {
                align: 'left',
                y: 25,
                x: 528
            },
            buttonTheme: {
                fill: 'none',
                stroke: 'none',
                'stroke-width': 0,
                style: {
                    fill: 'none',
                    style: {
                        color: 'gray',
                        fontWeight: 'normal'
                    }
                },
                states: {
                    hover: {
                        fill: 'silver',
                        style: {
                            color: 'black',
                            fontWeight: 'bold'
                        }

                    },
                    select: {
                        fill: 'none',
                        style: {
                            color: 'silver',
                            fontWeight: 'bold'
                        }
                    },
                    disabled: {
                        fill: 'none',
                        style: {
                            color: 'black',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            buttons: [{
                type: 'month',
                count: 3,
                text: '一季'
            }, {
                type: 'month',
                count: 6,
                text: '半年'
            }, {
                type: 'year',
                count: 1,
                text: '一年'
            }, {
                type: 'year',
                count: 2,
                text: '两年'
            }]

        },
        xAxis: {
            type: 'datetime',
            tickLength: 8,//X轴下标长度
            minRange: 3600 * 1000 * 24 * 7, // one week
            gridLineColor: '#FFF',
            gridLineWidth: 0,
            dateTimeLabelFormats: {
                day: '%y/%m/%d',
                week: '%y/%m/%d',
                month: '%Y/%m',
                year: '%Y'
            }
        },
        yAxis: [
            {
                title: {
                    text: 'K',
                    align: 'high',
                    rotation: 0,
                    offset: -58,
                    x: 57,
                    y: 18,
                    style:{
                        'font-size': '12px',
                        'color': '#707070'
                    }

                },
                height: '58%',
                lineWidth:0.6, //Y轴边缘线条粗细
                lineColor:'#3868a8',
                gridLineColor: '#3868a8',
                gridLineWidth:0.2,
                gridLineDashStyle: 'longdash'
            },{
                title: {
                    text: 'VOLUME',
                    align: 'high',
                    rotation: 0,
                    offset: -58,
                    x: 56,
                    y: 18,
                    style:{
                        'font-size': '12px',
                        'color': '#707070'
                    }
                },
                top: '58%',
                height: '26%',
                lineWidth:0.6,//Y轴边缘线条粗细
                lineColor:'#587888',
                gridLineColor: '#587888',
                gridLineWidth:0.2,
                gridLineDashStyle: 'longdash'
            },{
                title: {
                    text: 'MACD',
                    align: 'high',
                    rotation: 0,
                    offset: -58,
                    x: 58,
                    y: 18,
                    style:{
                        'font-size': '12px',
                        'color': '#707070'
                    }
                },
                top: '84%',
                height: '16%',
                lineWidth:0.6,//Y轴边缘线条粗细
                lineColor:'#587888',
                gridLineColor: '#587888',
                gridLineWidth:0.2,
                gridLineDashStyle: 'longdash'
            }
        ],


        scrollbar: {
            enabled: false,
            barBackgroundColor: 'gray',
            barBorderRadius: 5,
            barBorderWidth: 0,
            buttonBackgroundColor: 'gray',
            buttonBorderWidth: 0,
            buttonArrowColor: 'yellow',
            buttonBorderRadius: 5,
            rifleColor: 'yellow',
            trackBackgroundColor: 'white',
            trackBorderWidth: 1,
            trackBorderColor: 'silver',
            trackBorderRadius: 5,
            liveRedraw: false //设置scrollbar在移动过程中，chart不会重绘
        },

        navigator: {
            adaptToUpdatedData: false,
            xAxis: {
                labels: {
                    formatter: function(e) {
                        return Highcharts.dateFormat('%Y-%m-%d', this.value);
                    }
                }
            },
            outlineWidth: 1,
            height: 18,
            margin: 0
        },

        series: []

    });

    // 添加股票名字和代码
    $('<span>').appendTo($('#container')).css({
        position: 'absolute',
        'margin-top': 0,
        'margin-left': 0,
        left: 18,
        top: 22,
        'z-index': 4

    }).append('<span class="fore-stock-name">' + stock["name"] +
            '</span><span class="fore-stock-code">(' + stock["code"] +
            ')</span><span class="fore-stock-spell displaynone">' + stock["spell"] + '</span>'
        );

    //添加复权按钮
    $('<span>').appendTo($('#container')).css({
        position: 'absolute',
        'margin-top': 0,
        'margin-left': 0,
        left: 366,
        top: 21,
        'z-index': 5

    }).append('<span class="right-button" right="before">前复权</span>' +
            '<span class="right-button" right="normal">不复权</span>' +
            '<span class="right-button" right="after">后复权</span>'
    );
    $('.right-button').each(function(){
        $(this).addClass($(this).attr('right')==stock.right ? 'right-button-selected' : 'right-button-select');
        $(this).hover(function(){
            $(this).addClass('right-button-hover');
        },function(){
            $(this).removeClass('right-button-hover');
        });
        $(this).click(function(){
            if ($(this).attr('right')==stock.right) return;
            $('.right-button').each(function(){

                $(this).attr('class', 'right-button right-button-select');
            });
            $(this).attr('class', 'right-button right-button-selected');
            stock.right = $(this).attr('right');

            //更新数据
            setSeriesData();

        });
    });
    //添加自选股按钮
    $('<span>').appendTo($('#container')).css({
        position: 'absolute',
        'margin-top': 0,
        'margin-left': 0,
        left: 288,
        top: 20,
        'z-index': 5

    }).append('<a id="favorite">Favorite</a>');
    $('#favorite').click(function(){
        ForeFavorite.favoritelet();
    });

    //添加外挂链接
    $('<span>').appendTo($('#container')).css({
        position: 'absolute',
        'margin-top': 0,
        'margin-left': 0,
        left: 988,
        top: 22,
        'z-index': 5

    }).append('<a class="out-link" target="_blank" href="http://stockpage.10jqka.com.cn/' +
            stock['code'].substring(2)+ '/">同花顺</a>' +
            '<a class="out-link" target="_blank" href="http://quote.eastmoney.com/' +
            stock['code']+ '.html">东方财富</a>' +
            '<a class="out-link" target="_blank" href="Chart.php?code=' +
            stock['code']+ '">Chart</a>'
        );

    //更新数据
    setSeriesData();

    //添加设定的显示时间周期
    if (stock['period'] && stock['period'].start && stock['period'].end) {
        $('#container').highcharts().xAxis[0].setExtremes(
            stock['period'].start,
            stock['period'].end
        );
    }


    //添加到history
    ForeHistory.putHistory({
        name: stock["name"],
        code: stock["code"],
        spell: stock["spell"]
    });

    //自选股 管理/添加  管理对话框
    ForeFavorite.operateData = [{
        name: stock["name"],
        code: stock["code"],
        spell: stock["spell"]
    }];
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
});

