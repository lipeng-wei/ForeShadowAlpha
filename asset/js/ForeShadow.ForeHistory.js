/**
 * Created by lipeng_wei on 15-12-28.
 */
var ForeHistory = {

    localID         :   'ForeShadow-ForeHistory',
    historyUrl      :   'History.php',
    timeLine        :   [{
        text    :   '8 Hour',
        period  :   3600000*8
    },{
        text    :   '2 Day',
        period  :   3600000*24*2
    },{
        text    :   '1 Week',
        period  :   3600000*24*7
    },{
        text    :   '1 Month',
        period  :   3600000*24*30
    }],

    getTimeHistory  :   function(idx){
        var local = this.getLocalJson(this.localID);
        var all = [];
        var need = [];
        var now = (new Date()).getTime();
        var aT = now - this.timeLine[this.timeLine.length -1].period;
        var sT = this.timeLine[idx - 1] ? now - this.timeLine[idx - 1].period : now;
        var eT = this.timeLine[idx] ? now - this.timeLine[idx].period : aT;

        for(var i=0; i < local.length; i ++) {

            if (local[i].time > aT) all.push(local[i]);
            if (local[i].time < sT && local[i].time > eT) need.push({
                name: '<a target="_blank" href="http://localhost/ForeShadowAlpha/Stock.php?code=' + local[i].code + '">' +
                    '<span class="fore-stock-name">' + local[i].name + '</span>' +
                    '<span class="fore-stock-spell displaynone">' + local[i].spell + '</span></a>',

                code: ' <span class="fore-stock-code">' + local[i].code + '</span>',
                time: (new Date(local[i].time)).Format("yyyy-MM-dd hh:mm:ss")
            });
        }
        this.putLocalJson(this.localID, all);
        return need;
    },
    delTimeHistory  :   function(idx, data){
        var local = this.getLocalJson(this.localID);
        var all = [];
        var need = [];
        var now = (new Date()).getTime();
        var sT = this.timeLine[idx - 1] ? now - this.timeLine[idx - 1].period : now;
        var eT = this.timeLine[idx] ? now - this.timeLine[idx].period : aT;

        for(var i=0; i < local.length; i ++) {
            if (local[i].time < sT && local[i].time > eT) {
                if (local[i].name == data || local[i].code == data){

                } else all.push(local[i]);
            } else all.push(local[i]);
        }
        this.putLocalJson(this.localID, all);
        return need;
    },
    getColmnHistory :   function(){
        return [{
            title:'name',
            data: 'name'
        },{
            title:'code',
            data: 'code'
        },{
            title:'time',
            data: 'time'
        }];
    },
    putHistory  :   function(refer){
        var local = this.getLocalJson(this.localID);
        var now = (new Date()).getTime();
        var all = [];
        var need = [];
        if (local) {
            //console.log(now, this.timeLine[0].period);
            var eT = now - this.timeLine[0].period;
            for(var i=0; i < local.length; i ++) {
                //console.log(local[i].time, eT);
                if (local[i].time > eT ) {
                    if (local[i].name != refer.name && local[i].code != refer.code)
                    need.push(local[i]);
                } else {
                    all.push(local[i]);
                }
            }
        }
        need.unshift({
            'name': refer['name'],
            'code': refer['code'],
            'spell': refer['spell'],
            'time': (new Date()).getTime()

        });
        all = need.concat(all);
        this.putLocalJson(this.localID, all);
        return need;
    },
    getRecentHistory     :   function(idx){
        return this.getTimeHistory(0);
    },
    isVisited       :   function(local, data){
        var eT = this.timeLine[0].period;
        for(var i=0; i < local.length; i ++) {

            if (local[i].time < eT ) {
                if (local[i].name == data || local[i].code == data)
                    return true;
            } else break;
        }
        return false;
    },
    getTimeLine     :   function(idx){
        return this.timeLine[idx]? this.timeLine[idx].text : this.timeLine[0].text;
    },
    getIndexHtml    :   function(){
        var html = [];
        for(var i = 0; i < this.timeLine.length; i ++){
            html.push('<a target="sheetiframe" href="' + this.historyUrl + '#' +
            i + '">Time Line :  ' + this.timeLine[i].text + ' Within</a>');
        }
        return html.join('');

    },
    getLocalJson    :   function (id) {
        try {
            return JSON.parse(localStorage.getItem(id));
        } catch (e) {}
    },
    putLocalJson    :   function (id, data) {
        try {
            localStorage.setItem(id, JSON.stringify(data));
        } catch (e) {}
    }

}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}