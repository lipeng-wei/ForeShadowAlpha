/**
 * Created by lipeng_wei on 16-1-3.
 */

$.extend(ForeChart, {
    bodyScroll  	: 	null,
    primaryChart  	: 	null,
    setPrimarySeries: 	null,
    mainChart     	: 	null,
    setMainSeries   :   null,
    otherChart  	: 	null,
    setOtherSeries  :   null,
    hash            :   null,
    right           :   'before',
    calcPage 		: 	null
});



$(function () {

    //所有图设置时间周期
    ForeChart.setTimeInterval = function(min, max) {
        ForeChart.mainChart && ForeChart.mainChart.xAxis[0] && ForeChart.mainChart.xAxis[0].setExtremes(min, max);
        ForeChart.otherChart && ForeChart.otherChart.xAxis[0] && ForeChart.otherChart.xAxis[0].setExtremes(min, max);
    }
    //更新数据
    ForeChart.updateSeries = function() {
        ForeChart.mainChart && ForeChart.setMainSeries();
        ForeChart.otherChart && ForeChart.setOtherSeries();
        ForeChart.primaryChart && ForeChart.setPrimarySeries();
    }

    //primary图设置数据
    ForeChart.setPrimarySeries = function(){
        var series = ForeChart.primaryChart.series;
        var right = ForeChart.right;
        while(series.length > 0) {
            series[0].remove(false);
        }
        var sd = [{
            name: 'ohlc',
            data: ForeChart.data.day[right]['ohlc'],
            type: 'candlestick',
            yAxis: 0,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma5',
            data: ForeChart.data.day[right]['ma5'],
            type: 'spline',
            yAxis: 0,
            color: 'white',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma10',
            data: ForeChart.data.day[right]['ma10'],
            type: 'spline',
            yAxis: 0,
            color: 'yellow',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma20',
            data: ForeChart.data.day[right]['ma20'],
            type: 'spline',
            yAxis: 0,
            color: 'purple',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma30',
            data: ForeChart.data.day[right]['ma30'],
            type: 'spline',
            yAxis: 0,
            color: 'blue',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ma60',
            data: ForeChart.data.day[right]['ma60'],
            type: 'spline',
            yAxis: 0,
            color: 'darkgreen',
            dataGrouping: {
                enabled:false
            }
        },{
            name : 'gbbq',
            data : ForeChart.data.gbbq,
            type : 'flags',
            shape : 'squarepin',
            color : 'grey',
            fillColor : 'black',
            style: {
                color : 'grey'
            }
        }];

        for(var i=0; i<sd.length; i++)
            ForeChart.primaryChart.addSeries(sd[i], false);
        ForeChart.primaryChart.redraw();
    }
    //main图设置数据
    ForeChart.setMainSeries = function(){
        var series = ForeChart.mainChart.series;
        var right = ForeChart.right;
        while(series.length > 0) {
            series[0].remove(false);
        }
        var sd = [{
            name: 'volume',
            data: ForeChart.data.day[right]['volume'],
            type: 'column',
            yAxis: 0,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'macd',
            data: ForeChart.data.day[right]['macd'],
            type: 'column',
            yAxis: 1,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'dif',
            data: ForeChart.data.day[right]['dif'],
            type: 'spline',
            yAxis: 1,
            color: 'white',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'dea',
            data: ForeChart.data.day[right]['dea'],
            type: 'spline',
            yAxis: 1,
            color: 'yellow',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ddx',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.ddx),
            type: 'column',
            yAxis: 2,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ddy',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.ddy),
            type: 'column',
            yAxis: 3,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'ddz',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.ddz),
            type: 'column',
            yAxis: 4,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'tddz',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.tddz),
            type: 'column',
            yAxis: 5,
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'total_score',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.total_score),
            type: 'spline',
            yAxis: 6,
            color: 'purple',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'technical_score',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.technical_score),
            type: 'spline',
            yAxis: 6,
            color: 'yellow',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'funds_score',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.funds_score),
            type: 'spline',
            yAxis: 6,
            color: 'white',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'trade_score',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.trade_score),
            type: 'spline',
            yAxis: 6,
            color: 'blue',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'basic_score',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.basic_score),
            type: 'spline',
            yAxis: 6,
            color: 'darkgreen',
            dataGrouping: {
                enabled:false
            }
        },{
            name: 'message_score',
            data: ForeChart.matchPrimaryAxis(ForeChart.data.message_score),
            type: 'spline',
            yAxis: 6,
            color: 'red',
            dataGrouping: {
                enabled:false
            }
        },{
            name : 'info',
            data : ForeChart.data.info,
            type : 'flags',
            shape : 'squarepin',
            color : 'grey',
            fillColor : 'black',
            style: {
                color : 'grey'
            }
        }];

        for(var i=0; i<sd.length; i++)
            ForeChart.mainChart.addSeries(sd[i], false);
        ForeChart.mainChart.redraw();
    }

    //准备数据
    ForeChart.prepare();
    //初始化primary图
    $('.chart-primary').highcharts('StockChart', {

        chart: {
            height: 388,
            spacingBottom: 0,
            backgroundColor: 'black', //'transparent',
            //borderWidth: 1,
            zoomType: "x"

        },
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
                for(i =0; i<ForeChart.data.day[ForeChart.right].ohlc.length;i++){
                    if(this.x == ForeChart.data.day[ForeChart.right].ohlc[i][0]) break;
                }
                var lastClose = (ForeChart.data.day[ForeChart.right].ohlc[i-1] && ForeChart.data.day[ForeChart.right].ohlc[i-1][4])?
                    ForeChart.data.day[ForeChart.right].ohlc[i-1][4] : false;
                var c1 = (lastClose == false || lastClose <= ForeChart.data.day[ForeChart.right].ohlc[i][4])? 'red' : 'cyan';
                //股票名
                var str = '<span style="font-size:18px;font-weight: bold;color:' + c1 + ';">' + ForeChart.name + '</span><br/>';
                //时间
                str += '时间：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    Highcharts.dateFormat('%Y-%m-%d', this.x) + '</span><br/>';
                //开盘价
                var c2 = (lastClose == false || lastClose <= ForeChart.data.day[ForeChart.right].ohlc[i][1])? 'red' : 'cyan';
                str += '开盘：' + '<span style="font-weight: bold;color:' + c2 + ';">' +
                    this.points[0].point.open + '</span><br/>';
                //最高价
                c2 = (lastClose == false || lastClose <= ForeChart.data.day[ForeChart.right].ohlc[i][2])? 'red' : 'cyan';
                str += '最高：' + '<span style="font-weight: bold;color:' + c2 + ';">' +
                    this.points[0].point.high + '</span><br/>';
                //最低价
                c2 = (lastClose == false || lastClose <= ForeChart.data.day[ForeChart.right].ohlc[i][3])? 'red' : 'cyan';
                str += '最低：' + '<span style="font-weight: bold;color:' + c2 + ';">' +
                    this.points[0].point.low + '</span><br/>';
                //收盘价
                str += '收盘：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    this.points[0].point.close + '</span><br/>';
                //昨天收盘价
                if (lastClose) str += '昨收：' + lastClose + '<br/>';
                //涨额
                if (lastClose) str += '涨额：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    ForeChart.rawData.day[ForeChart.right][i].chg + '(' + ForeChart.rawData.day[ForeChart.right][i].percent + '%)</span><br/>';
                //涨幅
                if (lastClose) str += '涨幅：' + '<span style="font-weight: bold;color:' + c1 + ';">' +
                    Math.floor((ForeChart.data.day[ForeChart.right].ohlc[i][4]-lastClose)*10000/lastClose)/100 + '%</span><br/>';
                //MA5
                if (this.points[1]) str += '<span style="color:white;">MA5:' +
                    Math.round(this.points[1].y * 100) / 100 + '</span><br/>';
                //MA10
                if (this.points[2]) str += '<span style="color:yellow;">MA10:' +
                    Math.round(this.points[2].y * 100) / 100 + '</span><br/>';
                //MA20
                if (this.points[3]) str += '<span style="color:purple;">MA20:' +
                    Math.round(this.points[3].y * 100) / 100 + '</span><br/>';
                //MA30
                if (this.points[4]) str += '<span style="color:blue;">MA30:' +
                    Math.round(this.points[4].y * 100) / 100 + '</span><br/>';
                //MA60
                if (this.points[5]) str += '<span style="color:darkgreen;">MA60:' +
                    Math.round(this.points[5].y * 100) / 100 + '</span><br/>';
                return str;
            },
            //设置tips显示的相对位置
            positioner: function (boxW, BoxH, point) {
                var halfWidth = this.chart.chartWidth/2;
                var pX = this.chart.chartWidth - boxW - 44;
                var pY = (this.chart.chartHeight - BoxH) / 3 * 2;
                pY = pY < 0 ? 0 : pY;
                if(point.plotX < halfWidth){
                    return { x: pX, y: pY };
                }else{
                    return { x: 18, y: pY };
                }
            }
        },
        xAxis: {
            type: 'datetime',
            minRange: 3600 * 1000 * 24 * 7, // one week
            gridLineWidth: 0,
            lineColor: '#3868a8',
            tickColor: '#3868a8',
            tickLength: 3,
            tickWidth: 1,
            tickPosition: 'inside',
            showLastLabel: false,
            dateTimeLabelFormats: {
                day: '%y/%m/%d',
                week: '%y/%m/%d',
                month: '%Y/%m',
                year: '%Y'
            },
            labels:{
                align: 'left',
                y: -3
            },
            events:{
                setExtremes:function(event){
                    //console.log(event.min, event.max);
                    ForeChart.setTimeInterval(event.min, event.max);
                }
            }
        },
        yAxis: [{
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
            height: '100%',
            startOnTick: false,
            endOnTick: false,
            tickPositioner: function (){
                var positions = [],
                    i = this.dataMin;
                while (i < this.dataMax){
                    positions.push(i);
                    i = Math.floor(i*110)/100;
                }
                return positions;
            },
            lineWidth:0.6, //Y轴边缘线条粗细
            lineColor:'#3868a8',
            gridLineColor: '#3868a8',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        }],
        series: [],

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
        scrollbar: {
            enabled: false,
            liveRedraw: false
        },
        navigator: {
            adaptToUpdatedData: false,
            series:{
                lineWidth: 0
            },
            xAxis: {
                labels: {
                    formatter: function(e) {
                        return Highcharts.dateFormat('%Y-%m-%d', this.value);
                    }
                }
            },
            outlineColor: '#333333',
            outlineWidth: 0,
            height: 18,
            margin: 0
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
        }
    });
    ForeChart.primaryChart = $('.chart-primary').highcharts();
    //初始化main图
    $('.chart-main').highcharts('StockChart', {

        chart: {
            height: 958,
            backgroundColor: 'black',
            zoomType: "x"

        },
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
                    return this.point.text;
                }
                var i;
                for(i =0; i<ForeChart.data.day[ForeChart.right].volume.length;i++){
                    if(this.x == ForeChart.data.day[ForeChart.right].volume[i][0]) break;
                }
                //时间
                var str = '<span style="font-weight: bold;color:' + this.points[0].point.pointAttr[''].fill
                    + ';">' + Highcharts.dateFormat('%Y-%m-%d', this.x) + '</span><br/>';

                for (var j in this.points){
                    //VOLUME && TURNRATE
                    if (this.points[j].series.name == 'volume') {
                        str += '<span style="color:' + this.points[j].point.pointAttr[''].fill
                            + ';">VOLUME: ' + ForeChart.formatBigInt(this.points[j].y) + '</span><br/>';

                        if (ForeChart.rawData.day[ForeChart.right][i])
                            str +='<span style="color:' + this.points[j].point.pointAttr[''].fill + ';">TURNRATE: ' +
                                ForeChart.rawData.day[ForeChart.right][i].turnrate + '%</span><br/>';
                    }
                    //DIF
                    if (this.points[j].series.name == 'dif') str += '<span style="color:' + this.points[j].point.color + ';">DIF: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //DEA
                    if (this.points[j].series.name == 'dea') str += '<span style="color:' + this.points[j].point.color + ';">DEA: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //MACD
                    if (this.points[j].series.name == 'macd') str += '<span style="color:' + this.points[j].point.pointAttr[''].fill + ';">MACD: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';

                    //DDX
                    if (this.points[j].series.name == 'ddx') str += '<span style="color:' + this.points[j].point.pointAttr[''].fill + ';">DDX: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //DDY
                    if (this.points[j].series.name == 'ddy') str += '<span style="color:' + this.points[j].point.pointAttr[''].fill + ';">DDY: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //DDZ
                    if (this.points[j].series.name == 'ddz') str += '<span style="color:' + this.points[j].point.pointAttr[''].fill + ';">DDZ: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //TDDZ
                    if (this.points[j].series.name == 'tddz') str += '<span style="color:' + this.points[j].point.pointAttr[''].fill + ';">TDDZ: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';

                    //total_score
                    if (this.points[j].series.name == 'total_score') str += '<span style="color:' + this.points[j].point.color + ';">total_score: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //technical_score
                    if (this.points[j].series.name == 'technical_score') str += '<span style="color:' + this.points[j].point.color + ';">technical_score: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //funds_score
                    if (this.points[j].series.name == 'funds_score') str += '<span style="color:' + this.points[j].point.color + ';">funds_score: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //trade_score
                    if (this.points[j].series.name == 'trade_score') str += '<span style="color:' + this.points[j].point.color + ';">trade_score: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //basic_score
                    if (this.points[j].series.name == 'basic_score') str += '<span style="color:' + this.points[j].point.color + ';">basic_score: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                    //message_score
                    if (this.points[j].series.name == 'message_score') str += '<span style="color:' + this.points[j].point.color + ';">message_score: ' +
                        Math.round(this.points[j].y * 100) / 100 + '</span><br/>';
                }

                return str;
            },
            //设置tips显示的相对位置
            positioner: function (boxW, boxH, point) {

                var halfWidth = this.chart.chartWidth/2;
                var pX = this.chart.chartWidth - boxW - 44;
                var pY = ForeChart.bodyScroll.getScrollTop() + 10;
                pY = Math.min(pY, this.chart.chartHeight - boxH - 24);
                if(point.plotX < halfWidth){
                    return {x: pX, y: pY};
                }else{
                    return {x: 18, y: pY};
                }
            }
        },
        xAxis: {
            type: 'datetime',
            minRange: 3600 * 1000 * 24 * 7, // one week
            gridLineWidth: 0,
            lineColor: '#3868a8',
            tickColor: '#3868a8',
            tickLength: 3,
            tickWidth: 1,
            tickPosition: 'inside',
            showLastLabel: false,
            dateTimeLabelFormats: {
                day: '%y/%m/%d',
                week: '%y/%m/%d',
                month: '%Y/%m',
                year: '%Y'
            },
            labels:{
                align: 'left',
                y: -3
            }
        },
        yAxis: [{
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
            top: 0,
            height: 100,
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
            top: 100,
            height: 100,
            lineWidth:0.6,//Y轴边缘线条粗细
            lineColor:'#587888',
            gridLineColor: '#587888',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        },{
            title: {
                text: 'DDX',
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
            top: 200,
            height: 100,
            startOnTick: false,
            endOnTick: false,
            tickPositioner: function (){
                return [this.dataMax, 0, this.dataMin];
            },
            lineWidth:0.6,//Y轴边缘线条粗细
            lineColor:'#587888',
            gridLineColor: '#587888',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        },{
            title: {
                text: 'DDY',
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
            top: 300,
            height: 100,
            startOnTick: false,
            endOnTick: false,
            tickPositioner: function (){
                return [this.dataMax, 0, this.dataMin];
            },
            lineWidth:0.6,//Y轴边缘线条粗细
            lineColor:'#587888',
            gridLineColor: '#587888',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        },{
            title: {
                text: 'DDZ',
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
            top: 400,
            height: 100,
            startOnTick: false,
            endOnTick: false,
            tickPositioner: function (){
                return [this.dataMax, 0, this.dataMin];
            },
            lineWidth:0.6,//Y轴边缘线条粗细
            lineColor:'#587888',
            gridLineColor: '#587888',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        },{
            title: {
                text: 'TDDZ',
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
            top: 500,
            height: 100,
            startOnTick: false,
            endOnTick: false,
            tickPositioner: function (){
                return [this.dataMax, 0, this.dataMin];
            },
            lineWidth:0.6,//Y轴边缘线条粗细
            lineColor:'#587888',
            gridLineColor: '#587888',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        },{
            title: {
                text: 'THS',
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
            top: 600,
            height: 300,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 2, 4, 6, 8, 10],
            lineWidth:0.6,//Y轴边缘线条粗细
            lineColor:'#587888',
            gridLineColor: '#587888',
            gridLineWidth:0.2,
            gridLineDashStyle: 'longdash'
        }],
        series: [],

        rangeSelector: {
            enabled: true,
            selected: 1,
            inputEnabled: false,
            buttonTheme: {
                display: 'none'
            },
            buttons: [{
                type: 'month',
                count: 3
            }, {
                type: 'month',
                count: 6
            }, {
                type: 'year',
                count: 1
            }, {
                type: 'year',
                count: 2
            }]
        },
        navigator: {
            adaptToUpdatedData: false,
            handles: {
                backgroundColor: 'transparent',
                borderColor: 'transparent'
            },
            xAxis: {
                labels: {
                    enabled: false
                }
            },
            outlineWidth: 0,
            height: 0,
            margin: 0
        },
        scrollbar: {
            liveRedraw: false,
            enabled: false
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
        }
    });
    ForeChart.mainChart = $('.chart-main').highcharts();

    //------------------------------- 以下为平台默认的配置 -------------------------------//

    //添加滚动条
    ForeChart.bodyScroll = $("body").niceScroll({
        cursoropacitymax: 0.7,
        cursoropacitymin: 0.3,
        cursorborder: "2px solid #666666",
        cursorcolor: "#000000",
        cursorwidth: 5,
        cursorminheight: 56,
        scrollspeed: 158,
        horizrailenabled: false,
        enablekeyboard: false
    });

    // 添加股票名字和代码
    $('<span>').appendTo($('.chart-primary')).css({
        position: 'absolute',
        'margin-top': 0,
        'margin-left': 0,
        left: 18,
        top: 22,
        'z-index': 4

    }).append('<span class="fore-stock-name">' + ForeChart.name +
            '</span><span class="fore-stock-code">(' + ForeChart.code +
            ')</span><span class="fore-stock-spell displaynone">' + ForeChart.spell + '</span>'
        );

    //添加复权按钮
    $('<span>').appendTo($('.chart-primary')).css({
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
        $(this).addClass($(this).attr('right')==ForeChart.right ? 'right-button-selected' : 'right-button-select');
        $(this).hover(function(){
            $(this).addClass('right-button-hover');
        },function(){
            $(this).removeClass('right-button-hover');
        });
        $(this).click(function(){
            if ($(this).attr('right')==ForeChart.right) return;
            $('.right-button').each(function(){

                $(this).attr('class', 'right-button right-button-select');
            });
            $(this).attr('class', 'right-button right-button-selected');

            //更新数据
            ForeChart.right = $(this).attr('right');
            ForeChart.updateSeries();

        });
    });
    //添加自选股按钮
    $('<span>').appendTo($('.chart-primary')).css({
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
    $('<span>').appendTo($('.chart-primary')).css({
        position: 'absolute',
        'margin-top': 0,
        'margin-left': 0,
        left: 988,
        top: 22,
        'z-index': 5

    }).append('<a class="out-link" target="_blank" href="http://stockpage.10jqka.com.cn/' +
            ForeChart.code.substring(2)+ '/">同花顺</a>' +
            '<a class="out-link" target="_blank" href="http://quote.eastmoney.com/' +
            ForeChart.code + '.html">东方财富</a>'
        );

    //更新数据
    ForeChart.right = ForeChart.getHashParam('right');
    ForeChart.right = (ForeChart.right == 'before' || ForeChart.right == 'normal' ||
        ForeChart.right == 'after')? ForeChart.right : 'normal';
    ForeChart.updateSeries();


    //添加设定的显示时间周期
    ForeChart.startTime = ForeChart.getHashParam('start');
    ForeChart.startTime = ForeChart.startTime ? Date.parse(ForeChart.startTime) : false;
    ForeChart.endTime = ForeChart.getHashParam('end');
    ForeChart.endTime = ForeChart.endTime ? Date.parse(ForeChart.endTime) : false;
    //console.log(ForeChart.startTime, ForeChart.endTime);
    if (ForeChart.startTime && ForeChart.endTime) {
        ForeChart.primaryChart && ForeChart.primaryChart.xAxis[0] && ForeChart.primaryChart.xAxis[0]
            .setExtremes(ForeChart.startTime, ForeChart.endTime);
    } else {
        var e = ForeChart.primaryChart.xAxis[0].getExtremes();
        ForeChart.setTimeInterval(e.min, e.max);
    }


    //添加到history
    ForeHistory.putHistory({
        name: ForeChart.name,
        code: ForeChart.code,
        spell: ForeChart.spell
    });

    //自选股 管理/添加  管理对话框
    ForeFavorite.operateData = [{
        name: ForeChart.name,
        code: ForeChart.code,
        spell: ForeChart.spell
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
//Highcharts的默认配置
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

            var color = ForeChart.data.day[ForeChart.right].volumeColor[points[i].x];
            var seriesPointAttr = merge(series.pointAttr);

            seriesPointAttr[''].fill = color;
            seriesPointAttr.hover.fill = color;
            seriesPointAttr.select.fill = color;

            points[i].pointAttr = seriesPointAttr;
        }
    }
    if (series.name == "macd" || series.name == "ddx" || series.name == "ddy" || series.name == "ddz"
        || series.name == "tddz" ) {
        while (i--) {
            var macdPoint = points[i];

            var color = (macdPoint.y >= 0) ? 'red' : 'cyan';
            var seriesPointAttr = merge(series.pointAttr);

            seriesPointAttr[''].fill = color;
            seriesPointAttr.hover.fill = color;
            seriesPointAttr.select.fill = color;

            points[i].pointAttr = seriesPointAttr;
        }
    }
    originalDrawPoints.call(this);
};