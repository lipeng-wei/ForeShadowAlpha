/**
 * Created by lipeng_wei on 16-1-25.
 */
var ForeChart = {
    matchPrimaryAxis: function(rdata){
        var axis = this.data.day[this.right]['_axis'];
        var data = [];
        for (var i in rdata){
            if (axis[rdata[i][0]]) data.push(rdata[i]);
        }
        return data;
    },
    prepareGbbq: function(){
        var data = [];
        var rdata = this['rawData']['gbbq'];
        for(var i = 0; i < rdata.length; i++){
            data.push({
                x : Date.parse(rdata[i]['time']),
                title : rdata[i]['label']
            });
        }
        this.data['gbbq'] = data;
    },
    prepareInfo: function(){
        var data = [], tdata = {};
        var rdata = this['rawData']['rate'];
        for(var i = 0; i < rdata.length; i++){
            var t = rdata[i]['time'];
            tdata[t] = tdata[t] ? tdata[t] + 1 : 1;
        }
        for(var i in tdata){
            tdata[i] = tdata[i] + '次评级买入';
        }

        var rdata = this['rawData']['lhb'];
        for(var i = 0; i < rdata.length; i++){
            var t = rdata[i]['time'];
            tdata[t] = tdata[t] ? tdata[t] + '<br>' : '';
            tdata[t] += '龙虎榜';
        }
        tdata = ksort(tdata);
        for(var i in tdata){
            data.push({
                x : Date.parse(i),
                title : tdata[i],
                text : i + '<br>' + tdata[i]
            });
        }
        this.data['info'] = data;
    },
    prepareDde: function(){
        var data = {
            ddx:[],
            ddy:[],
            ddz:[],
            tddz:[]
        };
        var rdata = this['rawData']['dde'];
        for(var i = 0; i < rdata.length; i++){
            var time = Date.parse(rdata[i]['time']);
            data.ddx.push([
                time, // date
                this.parseNumber(rdata[i]['ddx'])
            ]);
            data.ddy.push([
                time, // date
                this.parseNumber(rdata[i]['ddy'])
            ]);
            data.ddz.push([
                time, // date
                this.parseNumber(rdata[i]['ddz'])
            ]);
            data.tddz.push([
                time, // date
                this.parseNumber(rdata[i]['tddz'])
            ]);

        }
        $.extend(this.data, data);
    },
    prepareThs: function(){
        var data = {
            total_score:[],
            technical_score:[],
            funds_score:[],
            trade_score:[],
            basic_score:[],
            message_score:[]
        };
        var rdata = this['rawData']['ths'];
        for(var i = 0; i < rdata.length; i++){
            var time = Date.parse(rdata[i]['time']);
            data.total_score.push([
                time, // date
                this.parseNumber(rdata[i]['total_score'])
            ]);
            data.technical_score.push([
                time, // date
                this.parseNumber(rdata[i]['technical_score'])
            ]);
            data.funds_score.push([
                time, // date
                this.parseNumber(rdata[i]['funds_score'])
            ]);
            data.trade_score.push([
                time, // date
                this.parseNumber(rdata[i]['trade_score'])
            ]);
            data.basic_score.push([
                time, // date
                this.parseNumber(rdata[i]['basic_score'])
            ]);
            data.message_score.push([
                time, // date
                this.parseNumber(rdata[i]['message_score'])
            ]);

        }
        $.extend(this.data, data);
    },
    prepareDay: function(){
        var data = {};
        for(var t in this['rawData']['day']) {
            data[t] ={
                _axis: {},
                ohlc: [],
                volume: [],
                volumeColor: {},
                ma5: [],
                ma10: [],
                ma20: [],
                ma30: [],
                ma60: [],
                dif: [],
                dea: [],
                macd: []
            };

            var tdata = this['rawData']['day'][t];
            for (var i = 0; i < tdata.length; i++) {

                var time = Date.parse(tdata[i]['time']);

                //把获取的数据放入ohlc 中
                data[t]['ohlc'].push([
                    time, // the date
                    this.parseNumber(tdata[i]['open']), // open
                    this.parseNumber(tdata[i]['high']), // high
                    this.parseNumber(tdata[i]['low']), // low
                    this.parseNumber(tdata[i]['close']) // close
                ]);
                data[t]['volume'].push([
                    time, // date
                    this.parseNumber(tdata[i]['volume']) // volume
                ]);

                if (i == 0 || data[t]['ohlc'][i][4] > data[t]['ohlc'][i-1][4])
                    data[t]['volumeColor'][time] = 'red';
                else
                    data[t]['volumeColor'][time] = 'cyan';

                //校正时间轴用 _axis
                data[t]['_axis'][time] = 1;

                data[t]['ma5'].push([
                    time, // date
                    this.parseNumber(tdata[i]['ma5']) // ma5
                ]);
                data[t]['ma10'].push([
                    time, // date
                    this.parseNumber(tdata[i]['ma10']) // ma10
                ]);
                data[t]['ma20'].push([
                    time, // date
                    this.parseNumber(tdata[i]['ma20']) // ma20
                ]);
                data[t]['ma30'].push([
                    time, // date
                    this.parseNumber(tdata[i]['ma30']) // ma30
                ]);
                data[t]['ma60'].push([
                    time, // date
                    this.parseNumber(tdata[i]['ma60']) // ma60
                ]);
                data[t]['dif'].push([
                    time, // date
                    this.parseNumber(tdata[i]['dif']) // dif
                ]);
                data[t]['dea'].push([
                    time, // date
                    this.parseNumber(tdata[i]['dea']) // dea
                ]);
                data[t]['macd'].push([
                    time, // date
                    this.parseNumber(tdata[i]['macd']) // macd
                ]);
            }
        }
        this.data['day'] = data;
    },
    prepareOther: function(){
    },
    prepare: function(){
        this.code = this['rawData']['code'];
        this.name = this['rawData']['name'];
        this.spell = this['rawData']['spell'];
        this.data = {};
        this.prepareDay();
        this.prepareGbbq();
        this.prepareDde();
        this.prepareThs();
        this.prepareInfo();
        this.prepareOther();
    },
    formatBigInt: function (data) {
        var i = 0, label = ['万', '亿', '万亿', '亿亿'];
        for (i = 0; i < label.length; i++) {
            if (data < Math.pow(10000, i + 1)) break;
        }
        if (i == 0) return data;
        var f = Math.round(data / Math.pow(10000, i) * 1000) / 1000;
        return '' + f + label[i - 1];
    },
    parseNumber: function (str) {
        if (str == "") return null;
        else return parseFloat(str);
    },
    getHashParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.hash.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    },
    setHashParam: function (name, value) {
        var hash = window.location.hash.substr(1);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = hash.match(reg);
        if (r == null) {
            if (hash) {
                hash = hash + "&" + name + "=" + value;
            } else {
                hash = name + "=" + value;
            }
        } else {
            var aParam = hash.split("&");
            for (var i = 0; i < aParam.length; i++) {
                if (aParam[i].substr(0, aParam[i].indexOf("=")) == name) {
                    aParam[i] = aParam[i].substr(0, aParam[i].indexOf("=")) + "=" + value;
                }
            }
            hash = aParam.join("&");
        }
        window.location.hash = '#' + hash;
    }
}

function ksort(inputArr, sort_flags) {
    //  discuss at: http://phpjs.org/functions/ksort/
    // original by: GeekFG (http://geekfg.blogspot.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //        note: The examples are correct, this is a new way
    //        note: This function deviates from PHP in returning a copy of the array instead
    //        note: of acting by reference and returning true; this was necessary because
    //        note: IE does not allow deleting and re-adding of properties without caching
    //        note: of property position; you can set the ini of "phpjs.strictForIn" to true to
    //        note: get the PHP behavior, but use this only if you are in an environment
    //        note: such as Firefox extensions where for-in iteration order is fixed and true
    //        note: property deletion is supported. Note that we intend to implement the PHP
    //        note: behavior by default if IE ever does allow it; only gives shallow copy since
    //        note: is by reference in PHP anyways
    //        note: Since JS objects' keys are always strings, and (the
    //        note: default) SORT_REGULAR flag distinguishes by key type,
    //        note: if the content is a numeric string, we treat the
    //        note: "original type" as numeric.
    //  depends on: i18n_loc_get_default
    //  depends on: strnatcmp
    //   example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
    //   example 1: data = ksort(data);
    //   example 1: $result = data
    //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
    //   example 2: ini_set('phpjs.strictForIn', true);
    //   example 2: data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'};
    //   example 2: ksort(data);
    //   example 2: $result = data
    //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}

    var tmp_arr = {},
        keys = [],
        sorter, i, k, that = this,
        strictForIn = false,
        populateArr = {};

    switch (sort_flags) {
        case 'SORT_STRING':
            // compare items as strings
            sorter = function (a, b) {
                return that.strnatcmp(a, b);
            };
            break;
        case 'SORT_LOCALE_STRING':
            // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)
            var loc = this.i18n_loc_get_default();
            sorter = this.php_js.i18nLocales[loc].sorting;
            break;
        case 'SORT_NUMERIC':
            // compare items numerically
            sorter = function (a, b) {
                return ((a + 0) - (b + 0));
            };
            break;
        // case 'SORT_REGULAR': // compare items normally (don't change types)
        default:
            sorter = function (a, b) {
                var aFloat = parseFloat(a),
                    bFloat = parseFloat(b),
                    aNumeric = aFloat + '' === a,
                    bNumeric = bFloat + '' === b;
                if (aNumeric && bNumeric) {
                    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                } else if (aNumeric && !bNumeric) {
                    return 1;
                } else if (!aNumeric && bNumeric) {
                    return -1;
                }
                return a > b ? 1 : a < b ? -1 : 0;
            };
            break;
    }

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    keys.sort(sorter);

    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    // END REDUNDANT
    strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js
        .ini['phpjs.strictForIn'].local_value !== 'off';
    populateArr = strictForIn ? inputArr : populateArr;

    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmp_arr[k] = inputArr[k];
        if (strictForIn) {
            delete inputArr[k];
        }
    }
    for (i in tmp_arr) {
        if (tmp_arr.hasOwnProperty(i)) {
            populateArr[i] = tmp_arr[i];
        }
    }

    return strictForIn || populateArr;
}

